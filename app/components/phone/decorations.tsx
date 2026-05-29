import type { CSSProperties } from "react";

export function PixelHeart({
  size = 12,
  color = "#D6336C",
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const cells = [
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 0, 0, 0],
  ];
  return (
    <svg
      aria-hidden
      width={size}
      height={(size * 6) / 7}
      viewBox="0 0 7 6"
      shapeRendering="crispEdges"
      className={className}
      style={style}
    >
      {cells.map((row, y) =>
        row.map((c, x) =>
          c ? (
            <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />
          ) : null
        )
      )}
    </svg>
  );
}

export function FourPointStar({
  size = 14,
  color = "#EB6E9E",
  className = "",
  style,
}: {
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
    >
      <path
        d="M12 1 L13.4 10.6 L23 12 L13.4 13.4 L12 23 L10.6 13.4 L1 12 L10.6 10.6 Z"
        fill={color}
      />
    </svg>
  );
}
