//https://stackoverflow.com/questions/57760111/javascript-map-find-at-the-same-time-findmap
function* map<T, R>(collection: T[], fn: (item: T) => R) {
  for (const item of collection) {
    yield fn(item);
  }
}

function find<T, R>(
  collection: Generator<T, R, unknown>,
  predicate: (item: any) => boolean
) {
  for (const item of collection) {
    if (predicate(item)) {
      return item;
    }
  }
}

export const lazyMapFind = <T, R>(
  collection: T[],
  mapper: (item: T) => R,
  predicate: (item: R) => boolean
) => find(map(collection, mapper), predicate);
