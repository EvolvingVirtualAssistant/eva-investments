// TODO Change this implementation in case the performance is affected
// https://gist.github.com/sunnyy02/2477458d4d1c08bde8cc06cd8f56702e#file-deepclone-ts
export function deepCopy<T>(source: T): T {
  return Array.isArray(source)
    ? source.map((item) => deepCopy(item))
    : source instanceof Date
    ? new Date(source.getTime())
    : source && typeof source === 'object'
    ? Object.getOwnPropertyNames(source).reduce((o, prop) => {
        const ownPropDescriptor = Object.getOwnPropertyDescriptor(source, prop);
        if (ownPropDescriptor !== undefined) {
          Object.defineProperty(o, prop, ownPropDescriptor);
        }
        o[prop] = deepCopy((source as any)[prop]);
        return o;
      }, Object.create(Object.getPrototypeOf(source)))
    : source;
}
