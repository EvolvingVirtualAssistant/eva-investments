import { test, assertEquals, assertThrows } from '../../wrap/testWrapper';
import { pathJoin, ROOT_PATH } from '../../../src/deps';
import { readJsonFile, readTextFile } from '../../../src/utils/files';

const currentDirPath = pathJoin(ROOT_PATH, 'tests/resources/utils');
const sampleTextFile = pathJoin(currentDirPath, 'sample.txt');
const sampleJsonFile = pathJoin(currentDirPath, 'sample.json');

test('Should throw error on reading directory', () => {
  assertThrows(() => readTextFile(currentDirPath));
});

test('Should throw error on reading missing file', () => {
  const missingFilePath = pathJoin(currentDirPath, 'missing.txt');
  assertThrows(() => readTextFile(missingFilePath));
});

test('Should get text file content', () => {
  const textFileContent = readTextFile(sampleTextFile);
  assertEquals(textFileContent, 'Sample text file');
});

test('Should throw syntax error on invalid JSON', () => {
  assertThrows(() => readJsonFile(sampleTextFile), SyntaxError);
});

test('Should get JSON file content', () => {
  const jsonFileContent = readJsonFile(sampleJsonFile);
  assertEquals(jsonFileContent['fileType'], 'JSON');
});
