// https://stackoverflow.com/questions/38508420/how-to-know-if-a-function-is-async
// Not perfect but will do for what I need
// eslint-disable-next-line @typescript-eslint/no-empty-function
const AsyncFunction = (async () => {}).constructor;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const GeneratorFunction = function* fun() {}.constructor;

export function isAsync(asyncFn: any): boolean {
  return (
    (asyncFn instanceof AsyncFunction &&
      AsyncFunction !== Function &&
      AsyncFunction !== GeneratorFunction) === true
  );
}
