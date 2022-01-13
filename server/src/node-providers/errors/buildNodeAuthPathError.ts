export class BuildNodeAuthPathError extends Error {
  constructor(obj: any) {
    super(`There was an error building NodeAuthPath from ${obj}`);
  }
}
