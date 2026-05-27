export default function LogoMark({ size = 60 }) {
  const aspect = 82 / 72
  const w = size
  const h = Math.round(size * aspect)

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 72 82"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Butte Strong Wellness shield"
    >
      {/* Shield body */}
      <path
        d="M36 2L4 14v24c0 20 13.5 34.5 32 42 18.5-7.5 32-22 32-42V14L36 2z"
        fill="#0B1F4A"
        stroke="#C9A84C"
        strokeWidth="2.5"
      />
      {/* Pulse / heartbeat line */}
      <polyline
        points="8,42 18,42 22,28 27,56 31,36 36,36 40,48 45,22 50,42 64,42"
        stroke="#C9A84C"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
