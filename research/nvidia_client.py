"""NVIDIA NIM (build.nvidia.com) chat client.

Uses urllib so the pipeline runs with stdlib only - no pip install needed.
Endpoint is OpenAI-compatible: POST /v1/chat/completions with Bearer auth.
"""
import json
import os
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Any

NIM_BASE_URL = os.environ.get("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
NIM_CHAT_URL = f"{NIM_BASE_URL}/chat/completions"


class NIMError(Exception):
    def __init__(self, status: int, body: str, model: str):
        super().__init__(f"NIM {status} on {model}: {body[:400]}")
        self.status = status
        self.body = body
        self.model = model


@dataclass
class ChatResult:
    model: str
    text: str
    raw: dict[str, Any] = field(default_factory=dict)
    elapsed_s: float = 0.0
    error: str | None = None


def _api_key() -> str:
    key = os.environ.get("NVIDIA_API_KEY")
    if not key:
        raise RuntimeError(
            "NVIDIA_API_KEY env var not set. Get one at https://build.nvidia.com "
            "and run: export NVIDIA_API_KEY=nvapi-..."
        )
    return key


def chat_complete(
    model: str,
    messages: list[dict[str, str]],
    *,
    max_tokens: int = 4096,
    temperature: float = 0.4,
    top_p: float = 0.95,
    timeout: int = 600,
    retries: int = 3,
    extra: dict[str, Any] | None = None,
) -> ChatResult:
    """Single blocking call to NVIDIA NIM. Retries on 429/5xx with backoff."""
    payload: dict[str, Any] = {
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "top_p": top_p,
        "stream": False,
    }
    if extra:
        payload.update(extra)

    body = json.dumps(payload).encode()
    headers = {
        "Authorization": f"Bearer {_api_key()}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    backoff = 2.0
    last_err: Exception | None = None
    t0 = time.time()
    for attempt in range(retries):
        try:
            req = urllib.request.Request(NIM_CHAT_URL, data=body, headers=headers, method="POST")
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                raw = json.loads(resp.read().decode())
            text = raw["choices"][0]["message"]["content"]
            return ChatResult(model=model, text=text, raw=raw, elapsed_s=time.time() - t0)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode(errors="replace") if hasattr(e, "read") else str(e)
            if e.code in (429, 500, 502, 503, 504) and attempt < retries - 1:
                time.sleep(backoff)
                backoff *= 2
                continue
            return ChatResult(
                model=model, text="", elapsed_s=time.time() - t0,
                error=f"HTTP {e.code}: {err_body[:300]}",
            )
        except urllib.error.URLError as e:
            last_err = e
            if attempt < retries - 1:
                time.sleep(backoff)
                backoff *= 2
                continue
            return ChatResult(
                model=model, text="", elapsed_s=time.time() - t0,
                error=f"URLError: {e.reason}",
            )
        except Exception as e:  # JSON shape, etc.
            return ChatResult(
                model=model, text="", elapsed_s=time.time() - t0,
                error=f"{type(e).__name__}: {e}",
            )

    return ChatResult(
        model=model, text="", elapsed_s=time.time() - t0,
        error=f"exhausted retries: {last_err}",
    )
