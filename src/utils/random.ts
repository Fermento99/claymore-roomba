export const randNoRep = (
  start: number,
  end: number,
  count: number,
  illegal: number[] = []
): number[] => {
  const all: number[] = [];
  const out: number[] = [];

  if (start > end) {
    const temp = start;
    end = start;
    start = temp;
  }

  for (let i = start; i < end; i++) {
    if (!illegal.includes(i)) all.push(i);
  }

  while (out.length < count) {
    const index = Math.floor(Math.random() * all.length);
    out.push(all[index]);
    all.splice(index, 1);
  }
  return out;
};
