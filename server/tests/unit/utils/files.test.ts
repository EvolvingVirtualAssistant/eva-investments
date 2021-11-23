import {
  assertEquals,
  assertThrows,
} from 'https://deno.land/std/testing/asserts.ts';
import { pathJoin, ROOT_PATH } from '../../../src/deps.ts';
import { readJsonFile, readTextFile } from '../../../src/utils/files.ts';

const currentDirPath = pathJoin(ROOT_PATH, 'tests/resources/utils');
const sampleTextFile = pathJoin(currentDirPath, 'sample.txt');
const sampleJsonFile = pathJoin(currentDirPath, 'sample.json');

Deno.test('Should throw error on reading directory', () => {
  assertThrows(() => readTextFile(currentDirPath));
});

Deno.test('Should throw error on reading missing file', () => {
  const missingFilePath = pathJoin(currentDirPath, 'missing.txt');
  assertThrows(() => readTextFile(missingFilePath));
});

Deno.test('Should get text file content', () => {
  const textFileContent = readTextFile(sampleTextFile);
  assertEquals(textFileContent, 'Sample text file');
});

Deno.test('Should throw syntax error on invalid JSON', () => {
  assertThrows(() => readJsonFile(sampleTextFile), SyntaxError);
});

Deno.test('Should get JSON file content', () => {
  const jsonFileContent = readJsonFile(sampleJsonFile);
  assertEquals(jsonFileContent['fileType'], 'JSON');
});
