export type Maybe<T> = T | undefined;

export function map2d<T, U>(ts: T[][], f: (t: T, i: number, j: number) => U): U[] {
  const result: U[] = [ ];
  for (let i = 0, iEnd = ts.length; i < iEnd; ++i) {
    for (let j = 0, jEnd = ts[i].length; j < jEnd; ++j) {
      result.push(f(ts[i][j], i, j));
    }
  }

  return result;
}

export function count<T>(iEnd: number, f: (i: number) => T): T[] {
  const result: T[] = [ ];
  for (let i = 0; i < iEnd; ++i) {
    result.push(f(i));
  }
  return result;
}

export function count2d<T>(iEnd: number, jEnd: number, f: (i: number, j: number) => T): T[] {
  const result: T[] = [ ];
  for (let i = 0; i < iEnd; ++i) {
    for (let j = 0; j < jEnd; ++j) {
      result.push(f(i, j));
    }
  }

  return result;
}
