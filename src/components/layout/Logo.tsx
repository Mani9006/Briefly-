interface LogoProps {
  size?: number
  className?: string
}

export default function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0c8eeb" />
          <stop offset="50%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#d946ef" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="180" height="180" rx="40" fill="url(#logoGrad)" />
      <g transform="translate(50, 40)">
        <rect x="0" y="0" width="14" height="120" rx="7" fill="white" />
        <rect x="28" y="5" width="10" height="45" rx="5" fill="white" opacity="0.95" />
        <rect x="50" y="14" width="10" height="27" rx="5" fill="white" opacity="0.9" />
        <rect x="72" y="10" width="10" height="35" rx="5" fill="white" opacity="0.85" />
        <rect x="28" y="68" width="10" height="48" rx="5" fill="white" opacity="0.95" />
        <rect x="50" y="75" width="10" height="35" rx="5" fill="white" opacity="0.9" />
        <rect x="72" y="70" width="10" height="42" rx="5" fill="white" opacity="0.85" />
        <rect x="94" y="78" width="10" height="28" rx="5" fill="white" opacity="0.8" />
      </g>
    </svg>
  )
}
