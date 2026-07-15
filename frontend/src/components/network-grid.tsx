// Subtle animated network-grid background for auth + hero pages.
// Pure SVG + CSS — no libraries, no autoplay video.
export function NetworkGrid({ className = "" }: { className?: string }) {
  const nodes = [
    [12, 18], [28, 12], [46, 24], [64, 14], [82, 22],
    [18, 42], [38, 48], [58, 38], [78, 46], [90, 32],
    [10, 68], [30, 72], [50, 62], [70, 74], [88, 66],
    [22, 88], [44, 84], [62, 92], [80, 82],
  ] as const;
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [1, 6], [2, 6], [3, 7], [4, 9],
    [5, 6], [6, 7], [7, 8], [8, 9],
    [5, 10], [6, 11], [7, 12], [8, 13], [9, 14],
    [10, 11], [11, 12], [12, 13], [13, 14],
    [10, 15], [11, 15], [12, 16], [13, 17], [14, 18],
    [15, 16], [16, 17], [17, 18],
  ];

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 grid-bg opacity-70" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {edges.map(([a, b], i) => {
          const [x1, y1] = nodes[a];
          const [x2, y2] = nodes[b];
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--primary)"
              strokeOpacity="0.18"
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {nodes.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="1.6" fill="url(#node-glow)" opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.3;0.9;0.3"
                dur={`${4 + (i % 5)}s`}
                repeatCount="indefinite"
                begin={`${i * 0.2}s`}
              />
            </circle>
            <circle cx={x} cy={y} r="0.5" fill="var(--primary-glow)" />
          </g>
        ))}
      </svg>
    </div>
  );
}
