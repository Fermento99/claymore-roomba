export const getNeighbours = (
  x: number,
  y: number,
  height: number,
  width: number
): number[][] => {
  const out = [];

  if (x > 0) {
    if (y > 0) out.push([y - 1, x - 1]);
    out.push([y, x - 1]);
    if (y < height - 1) out.push([y + 1, x - 1]);
  }
  if (y > 0) out.push([y - 1, x]);
  if (y < height - 1) out.push([y + 1, x]);
  if (x < width - 1) {
    if (y > 0) out.push([y - 1, x + 1]);
    out.push([y, x + 1]);
    if (y < height - 1) out.push([y + 1, x + 1]);
  }

  return out;
};
