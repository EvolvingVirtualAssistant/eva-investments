import { Dictionary } from '../../types/types';
import { pathJoin } from '../../deps';
import { getObjFromJson, writeJsonFile } from '../files';

// Work on other repos
// all the repos have the same formats:
// - in memory
// - in file
// - in file with memory cache
// - in memory (with file watcher)
// this one is in file with memory cache

export abstract class FileAndMemoryCacheAdapter<T> {
  protected _cachedCollection!: T[] | Dictionary<T>;

  private _envKey: string;
  private _rootPath: string;
  private _isArray: boolean;
  private _buildObj?: (objToBuild: T) => T;
  private _keyTransformation?: (...args: unknown[]) => unknown;
  private _keyValidation?: (key: unknown) => boolean;

  protected constructor(
    envKey: string,
    rootPath: string,
    isArray: boolean,
    buildObj?: (objToBuild: T) => T,
    keyTransformation?: (...args: unknown[]) => unknown,
    keyValidation?: (key: unknown) => boolean
  ) {
    this._envKey = envKey;
    this._rootPath = rootPath;
    this._isArray = isArray;
    this._buildObj = buildObj;
    this._keyTransformation = keyTransformation;
    this._keyValidation = keyValidation;

    this._cachedCollection = this._loadFromFile();
  }

  protected abstract get cachedCollection(): T[] | Dictionary<T>;
  protected abstract set cachedCollection(collection: T[] | Dictionary<T>);

  protected abstract loadFromFile(): T[] | Dictionary<T>;
  protected abstract writeToFile(collection: T[] | Dictionary<T>): void;

  protected abstract getObjectForType(): T;

  protected _loadFromFile(): T[] | Dictionary<T> {
    return getObjFromJson(
      this._envKey,
      this._rootPath,
      getBuildCollection(
        this._buildObj != null
          ? (objToBuild: T, _: T) => this._buildObj!(objToBuild)
          : buildObj,
        this.getObjectForType(),
        this._keyTransformation
      ),
      getValidateCollection(
        this._isArray,
        pathJoin(this._rootPath, process.env[this._envKey] || ''),
        this._keyValidation
      )
    );
  }

  protected _writeToFile(collection: T[] | Dictionary<T>): void {
    writeJsonFile(
      pathJoin(this._rootPath, process.env[this._envKey] || ''),
      collection
    );
  }
}

const buildObj = <T>(obj: unknown, sampleObj: T): T => {
  if (!isObjOfSameType(obj, sampleObj)) {
    throw new Error(
      `There was an error building object ${JSON.stringify(
        obj
      )} like sample object ${JSON.stringify(sampleObj)}`
    );
  }

  // It shouldn't be null by this point (it would have failed in the previous validation)
  if (typeof obj !== 'object' || obj == null) {
    return obj as T;
  }

  const objKeys = Object.keys(obj);
  const arrayProps = [];
  const objProps = [];
  for (const key in objKeys) {
    if (Array.isArray((obj as Record<string, any>)[key])) {
      arrayProps.push(key);
    }

    if (typeof (obj as Record<string, any>)[key] === 'object') {
      objProps.push(key);
    }
  }

  const res = {
    ...(obj as T)
  };

  arrayProps.forEach((key) => {
    const sampleProp = (sampleObj as Record<string, Array<any>>)[key][0];
    res[key as keyof T] = (obj as Record<string, Array<any>>)[key].map((elem) =>
      buildObj(elem, sampleProp)
    ) as any;
  });

  objProps.forEach((key) => {
    res[key as keyof T] = buildObj(
      (obj as Record<string, object>)[key],
      (sampleObj as Record<string, object>)[key]
    ) as any;
  });

  return res;
};

// If this doesn't work, try to use isType
const isObjOfSameType = <T>(obj: unknown, sampleObj: T): boolean => {
  if (obj == null || sampleObj == null) {
    return false;
  }

  if (typeof obj !== 'object') {
    return typeof obj === typeof sampleObj;
  }

  const sampleKeys = Object.keys(sampleObj);

  for (const key of sampleKeys) {
    if (!(key in obj)) {
      return false;
    }

    const objProp = (obj as Record<string, any>)[key];
    const samplePropType = typeof (sampleObj as Record<string, any>)[key];

    if (
      objProp == null ||
      (Array.isArray(samplePropType) && !Array.isArray(objProp)) ||
      typeof objProp !== samplePropType
    ) {
      return false;
    }
  }

  return true;
};

const getBuildCollection = <T>(
  buildObj: (objToBuild: T, sampleObj: T) => T,
  sampleObj: T,
  keyTransformation?: (...args: unknown[]) => unknown
): ((collection: T[] | Dictionary<T>) => T[] | Dictionary<T>) => {
  return (collection: unknown): T[] | Dictionary<T> =>
    Array.isArray(collection)
      ? collection.map((elem) => buildObj(elem, sampleObj))
      : Object.fromEntries(
          Object.entries(collection as Dictionary<T>).map((entry) => [
            keyTransformation == null ? entry[0] : keyTransformation(entry[0]),
            buildObj(entry[1] as T, sampleObj)
          ])
        );
};

const getValidateCollection = <T>(
  shouldBeArray: boolean,
  filePath: string,
  isKeyValid?: (key: unknown) => boolean
): ((collection: T[] | Dictionary<T>) => void) => {
  return (collection: unknown): void => {
    if (collection == null) {
      throw new Error('');
    }

    if (shouldBeArray && !Array.isArray(collection)) {
      throw new Error(`Unable to retrieve an array from json file ${filePath}`);
    } else if (
      !shouldBeArray &&
      isKeyValid != null &&
      Object.keys(collection as Dictionary<any>).some(
        (key) => !isKeyValid(Number(key))
      )
    ) {
      throw new Error('');
    }
  };
};
