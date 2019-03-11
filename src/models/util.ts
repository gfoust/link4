export type Maybe<T> = T | null;

export type Dictionary<T, K extends string | number | symbol = keyof any> = {
  [P in K]: T;
};
