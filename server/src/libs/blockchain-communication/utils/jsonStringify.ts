// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
export function jsonStringify(obj: any) {
  const objs = new WeakSet();
  return JSON.stringify(obj, (_key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (objs.has(value)) {
        return;
      }

      objs.add(value);
    }

    return value;
  });
}
