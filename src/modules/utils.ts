
export type Entries<T> = Array<{
  [K in keyof T]: [K, T[K]]
}[keyof T]>

export type PathValue<T, P extends string> = 
  P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
        ? PathValue<T[Key], Rest>
          : never
      : P extends keyof T
    ? T[P]
      : never

export type Mutable<T> = { -readonly [P in keyof T]: T[P] }

export type DeepReadonlyExclude<T> = {
  ____MUTABLE____: true
  value: T
}
export type DeepReadonly<T> = T extends Function ? T
    : T extends DeepReadonlyExclude<infer U> ? U
    : T extends Map<infer K, infer V>
        ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
    : T extends Set<infer U>
        ? ReadonlySet<DeepReadonly<U>>
    : T extends Array<infer U>
        ? ReadonlyArray<DeepReadonly<U>>
    : T extends object
        ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;


export function nextFrame(): Promise<number> {
  return new Promise((resolve:FrameRequestCallback) => requestAnimationFrame(resolve))
}

export function wait(ms:number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function round(value: number, decimals:number = 0): number {
  const m = Math.pow(10, decimals);
  return Math.round(value * m) / m;
}

const CSS_SIZE_REGEX = /^-?\d+(\.\d+)?/;
export function parseCssSize(size?: string): number {
  if (!size) return 0;
  const parsed = parseFloat(CSS_SIZE_REGEX.exec(size)?.[0] || '0');
  return Number.isNaN(parsed) ? 0 : parsed;
}
