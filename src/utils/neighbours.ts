import { Point } from '../models/Point';

export const getNeighbours = (
  point: Point,
  height: number,
  width: number
): Point[] => {
  const { x, y } = point;
  const out: Point[] = [];

  if (x > 0) {
    if (y > 0) out.push({ y: y - 1, x: x - 1 });
    out.push({ y, x: x - 1 });
    if (y < height - 1) out.push({ y: y + 1, x: x - 1 });
  }
  if (y > 0) out.push({ y: y - 1, x });
  if (y < height - 1) out.push({ y: y + 1, x });
  if (x < width - 1) {
    if (y > 0) out.push({ y: y - 1, x: x + 1 });
    out.push({ y, x: x + 1 });
    if (y < height - 1) out.push({ y: y + 1, x: x + 1 });
  }

  return out;
};
