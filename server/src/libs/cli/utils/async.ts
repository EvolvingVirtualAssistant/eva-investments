// https://stackoverflow.com/questions/38508420/how-to-know-if-a-function-is-async
// Not perfect but will do for what I need
const AsyncFunction = (async () => {}).constructor;
const GeneratorFunction = (function* fun() {}).constructor;

export function isAsync(asyncFn: any): boolean {
    return (asyncFn instanceof AsyncFunction && AsyncFunction !== Function && AsyncFunction !== GeneratorFunction) === true;
}