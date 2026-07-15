export function ConvoxaMark({ size = 36, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="convoxa-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F9AECB" />
          <stop offset="100%" stopColor="#C93E79" />
        </linearGradient>
      </defs>

      {/* Chat bubble shape with tail */}
      <path
        d="M20 4C11.163 4 4 10.505 4 18.5c0 4.372 2.14 8.294 5.53 10.958-.146 1.94-.77 3.99-1.83 5.89a.75.75 0 0 0 .87 1.08c2.79-.77 5.24-2.03 7.12-3.4A19.7 19.7 0 0 0 20 33c8.837 0 16-6.505 16-14.5S28.837 4 20 4Z"
        fill="url(#convoxa-grad)"
      />

      {/* Letter C */}
      <path
        d="M24.6 14.3a6 6 0 1 0 0 8.4"
        fill="none"
        stroke="white"
        strokeWidth="3.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({ size = 36, textClassName = "" }) {
  return (
    <>
      <ConvoxaMark size={size} className="shrink-0 drop-shadow-sm" />
      <span
        className={`font-bold tracking-[-0.01em] ${textClassName}`}
      >
        Convoxa
      </span>
    </>
  );
}
