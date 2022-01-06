import { test, assertEquals } from '../../../../wrap/testWrapper';
import { pathJoin, ROOT_PATH } from '../../../../../src/deps';
import { attemptImport } from '../../../../../src/libs/blockchain-communication/utils/import';

const currentDirPath = pathJoin(
  /*'file://', */ ROOT_PATH,
  'tests/resources/utils'
);
const sampleImportPath = pathJoin(currentDirPath, 'sampleImport');

test('Should get empty array of imports on wrong path (no fallback specified)', async () => {
  const importedDeps = await attemptImport(
    pathJoin(currentDirPath, 'missingImport')
  );

  assertEquals(importedDeps.length, 0);
});

test('Should get fallback import on wrong path', async () => {
  const importedDeps = await attemptImport(
    pathJoin(currentDirPath, 'missingImport'),
    [],
    {
      prop1: () => true
    }
  );

  assertEquals(importedDeps.length, 1);
  assertEquals(importedDeps[0].name, 'prop1');
});

test('Should get empty array of imports on inexistent props', async () => {
  const importedDeps = await attemptImport(sampleImportPath, [
    'missingProp1',
    'missingProp2'
  ]);

  assertEquals(importedDeps.length, 0);
});

test('Should get only existent imports', async () => {
  const importedDeps = await attemptImport(sampleImportPath, [
    'missingProp1',
    'testFunc1'
  ]);

  console.log(importedDeps[0].name);

  assertEquals(importedDeps.length, 1);
  assertEquals(importedDeps[0].name, 'testFunc1');
});

test('Should get all imports, when no props are specified', async () => {
  const importedDeps = await attemptImport(sampleImportPath);

  assertEquals(importedDeps.length, 2);
  assertEquals(importedDeps[0].name, 'testFunc1');
  assertEquals(importedDeps[1].name, 'testFunc2');
});

test('Should get all imports, when empty array of props are specified', async () => {
  const importedDeps = await attemptImport(sampleImportPath, []);

  assertEquals(importedDeps.length, 2);
  assertEquals(importedDeps[0].name, 'testFunc1');
  assertEquals(importedDeps[1].name, 'testFunc2');
});

test('Should get specified imports', async () => {
  const importedDeps = await attemptImport(sampleImportPath, ['testFunc1']);

  assertEquals(importedDeps.length, 1);
  assertEquals(importedDeps[0].name, 'testFunc1');
});
