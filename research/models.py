"""Top-tier models on the NVIDIA NIM catalog (build.nvidia.com).

We pick a diverse, high-capability set: large dense, MoE, dedicated reasoning,
and code-strong models. Names match the model IDs accepted by the NIM API.

If a particular model ID is unavailable in your account, the orchestrator
records the error and continues - the run does not abort.
"""
from dataclasses import dataclass


@dataclass(frozen=True)
class ModelSpec:
    id: str            # NIM model id
    label: str         # short display name
    family: str        # nvidia / meta / deepseek / mistral / qwen / ...
    role: str          # researcher / reasoner / critic / synthesizer
    reasoning: bool    # uses long-CoT reasoning style
    max_tokens: int    # request cap
    temperature: float


HIGH_TIER_MODELS: list[ModelSpec] = [
    ModelSpec(
        id="nvidia/llama-3.1-nemotron-ultra-253b-v1",
        label="nemotron-ultra-253b",
        family="nvidia", role="reasoner", reasoning=True,
        max_tokens=6000, temperature=0.4,
    ),
    ModelSpec(
        id="nvidia/llama-3.3-nemotron-super-49b-v1",
        label="nemotron-super-49b",
        family="nvidia", role="researcher", reasoning=True,
        max_tokens=5000, temperature=0.4,
    ),
    ModelSpec(
        id="meta/llama-3.1-405b-instruct",
        label="llama-3.1-405b",
        family="meta", role="researcher", reasoning=False,
        max_tokens=5000, temperature=0.5,
    ),
    ModelSpec(
        id="meta/llama-3.3-70b-instruct",
        label="llama-3.3-70b",
        family="meta", role="researcher", reasoning=False,
        max_tokens=4096, temperature=0.5,
    ),
    ModelSpec(
        id="deepseek-ai/deepseek-r1",
        label="deepseek-r1",
        family="deepseek", role="reasoner", reasoning=True,
        max_tokens=6000, temperature=0.6,
    ),
    ModelSpec(
        id="deepseek-ai/deepseek-v3",
        label="deepseek-v3",
        family="deepseek", role="researcher", reasoning=False,
        max_tokens=5000, temperature=0.4,
    ),
    ModelSpec(
        id="mistralai/mistral-large-2-instruct",
        label="mistral-large-2",
        family="mistral", role="researcher", reasoning=False,
        max_tokens=4096, temperature=0.4,
    ),
    ModelSpec(
        id="mistralai/mixtral-8x22b-instruct-v0.1",
        label="mixtral-8x22b",
        family="mistral", role="researcher", reasoning=False,
        max_tokens=4096, temperature=0.5,
    ),
    ModelSpec(
        id="qwen/qwq-32b",
        label="qwq-32b",
        family="qwen", role="reasoner", reasoning=True,
        max_tokens=6000, temperature=0.5,
    ),
    ModelSpec(
        id="qwen/qwen2.5-coder-32b-instruct",
        label="qwen2.5-coder-32b",
        family="qwen", role="critic", reasoning=False,
        max_tokens=4096, temperature=0.3,
    ),
    ModelSpec(
        id="microsoft/phi-4",
        label="phi-4",
        family="microsoft", role="researcher", reasoning=False,
        max_tokens=4096, temperature=0.4,
    ),
    ModelSpec(
        id="01-ai/yi-large",
        label="yi-large",
        family="01-ai", role="researcher", reasoning=False,
        max_tokens=4096, temperature=0.5,
    ),
]


SYNTHESIZER_PREFERRED = [
    "deepseek-ai/deepseek-r1",
    "nvidia/llama-3.1-nemotron-ultra-253b-v1",
    "meta/llama-3.1-405b-instruct",
]


def by_role(role: str) -> list[ModelSpec]:
    return [m for m in HIGH_TIER_MODELS if m.role == role]


def by_id(model_id: str) -> ModelSpec | None:
    for m in HIGH_TIER_MODELS:
        if m.id == model_id:
            return m
    return None
