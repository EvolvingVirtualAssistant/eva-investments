export class BuildNodeError extends Error {
  constructor(classToBuild: string, obj: any) {
    super(`There was an error building a ${classToBuild} from ${obj}`);
  }
}
