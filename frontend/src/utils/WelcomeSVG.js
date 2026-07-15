export const WelcomeSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 480 320"
    fill="none"
  >
    <title>chat_illustration</title>

    {/* ground shadow */}
    <ellipse cx="240" cy="288" rx="170" ry="10" fill="#E8B8CB" opacity="0.15" />

    {/* left person, sitting, facing right */}
    <g stroke="#E16CA1" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* chair / bean bag */}
      <path d="M70 260 q-6 -46 40 -50 q46 -4 44 46 z" fill="#E16CA1" fillOpacity="0.08" />
      {/* body */}
      <path d="M96 250 v-46 q0 -22 22 -22 q22 0 22 22 v46" />
      {/* arm gesturing */}
      <path d="M140 208 q22 -4 30 -22" />
      {/* head */}
      <circle cx="118" cy="150" r="20" fill="#E16CA1" fillOpacity="0.08" />
      {/* legs */}
      <path d="M100 250 q-4 14 -18 16" />
      <path d="M136 250 q4 14 18 16" />
    </g>

    {/* right person, sitting, facing left */}
    <g stroke="#C93770" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M410 260 q6 -46 -40 -50 q-46 -4 -44 46 z" fill="#C93770" fillOpacity="0.08" />
      <path d="M384 250 v-46 q0 -22 -22 -22 q-22 0 -22 22 v46" />
      <path d="M340 208 q-22 -4 -30 -22" />
      <circle cx="362" cy="150" r="20" fill="#C93770" fillOpacity="0.08" />
      <path d="M380 250 q4 14 18 16" />
      <path d="M344 250 q-4 14 -18 16" />
    </g>

    {/* speech bubble from left person */}
    <g>
      <rect x="150" y="70" width="80" height="46" rx="14" fill="#E16CA1" />
      <path d="M172 116 l-6 16 18 -16 z" fill="#E16CA1" />
      <circle cx="174" cy="93" r="4" fill="white" />
      <circle cx="190" cy="93" r="4" fill="white" />
      <circle cx="206" cy="93" r="4" fill="white" />
    </g>

    {/* speech bubble from right person */}
    <g>
      <rect x="250" y="130" width="80" height="46" rx="14" fill="#C93770" />
      <path d="M308 176 l6 16 -18 -16 z" fill="#C93770" />
      <circle cx="272" cy="153" r="4" fill="white" />
      <circle cx="288" cy="153" r="4" fill="white" />
      <circle cx="304" cy="153" r="4" fill="white" />
    </g>

    {/* small floating accents */}
    <circle cx="90" cy="90" r="5" fill="#E16CA1" opacity="0.3" />
    <circle cx="400" cy="80" r="6" fill="#C93770" opacity="0.2" />
    <circle cx="60" cy="200" r="4" fill="#E16CA1" opacity="0.25" />
  </svg>
);