/**
 * Pixel-art icons drawn from ASCII grids: `#` is a filled pixel, anything else
 * is empty. Adjacent pixels on a row merge into one rect, so a 14x14 icon is a
 * few dozen rects at most. Inline SVG with `crispEdges`, so they stay sharp at
 * any size and inherit `currentColor`.
 */
function PixelIcon({ rows, className }: { rows: readonly string[]; className?: string }) {
  const width = Math.max(...rows.map((row) => row.length));
  const rects: Array<{ x: number; y: number; w: number }> = [];

  rows.forEach((row, y) => {
    let start = -1;
    for (let x = 0; x <= row.length; x++) {
      const filled = row[x] === "#";
      if (filled && start < 0) start = x;
      if (!filled && start >= 0) {
        rects.push({ x: start, y, w: x - start });
        start = -1;
      }
    }
  });

  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox={`0 0 ${width} ${rows.length}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects.map(({ x, y, w }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} />
      ))}
    </svg>
  );
}

const ARROW_UP_RIGHT = [
  "..######",
  "....####",
  "...#####",
  "..###.##",
  ".###..##",
  "###.....",
  "##......",
  "........",
];

const ARROW_UP = [
  "...##...",
  "..####..",
  ".######.",
  "###..###",
  "...##...",
  "...##...",
  "...##...",
  "...##...",
];

const ARROW_DOWN = [...ARROW_UP].reverse();

const SUN = [
  "......##......",
  "......##......",
  ".##........##.",
  ".##..####..##.",
  "....######....",
  "...########...",
  "##.########.##",
  "##.########.##",
  "...########...",
  "....######....",
  ".##..####..##.",
  ".##........##.",
  "......##......",
  "......##......",
];

const MOON = [
  ".....####.....",
  "...#####......",
  "..####........",
  ".####.........",
  ".###..........",
  "####..........",
  "####..........",
  "####..........",
  "####.........#",
  ".###........##",
  ".####......##.",
  "..#####..####.",
  "...########...",
  ".....####.....",
];

export const ArrowUpRightIcon = () => <PixelIcon rows={ARROW_UP_RIGHT} />;
export const ArrowUpIcon = () => <PixelIcon rows={ARROW_UP} />;
export const ArrowDownIcon = () => <PixelIcon rows={ARROW_DOWN} />;
export const SunIcon = ({ className }: { className?: string }) => <PixelIcon rows={SUN} className={className} />;
export const MoonIcon = ({ className }: { className?: string }) => <PixelIcon rows={MOON} className={className} />;
