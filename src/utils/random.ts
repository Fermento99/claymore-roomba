/**
 * Function used for generating arrays of not repeating numbers from given interval
 * @param start - start of the interval
 * @param end - end of the interval
 * @param count - requested size of returned array
 * @param illegal - array of numbers that cannot be in result array
 * @returns array of random numbers
 */
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

  while (out.length < count && all.length > 0) {
    const index = Math.floor(Math.random() * all.length);
    out.push(all[index]);
    all.splice(index, 1);
  }

  return out;
};
