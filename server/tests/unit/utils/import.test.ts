import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { pathJoin, ROOT_PATH } from '../../../src/deps.ts';
import { attemptImport } from '../../../src/utils/import.ts';

const currentDirPath = pathJoin('file://', ROOT_PATH, 'tests/resources/utils');
const sampleImportPath = pathJoin(currentDirPath, 'sampleImport.ts');

Deno.test(
  'Should get empty array of imports on wrong path (no fallback specified)',
  async () => {
    const importedDeps = await attemptImport(
      pathJoin(currentDirPath, 'missingImport.ts')
    );

    assertEquals(importedDeps.length, 0);
  }
);

Deno.test('Should get fallback import on wrong path', async () => {
  const importedDeps = await attemptImport(
    pathJoin(currentDirPath, 'missingImport.ts'),
    [],
    {
      prop1: () => true,
    }
  );

  assertEquals(importedDeps.length, 1);
  assertEquals(importedDeps[0].name, 'prop1');
});

Deno.test('Should get empty array of imports on inexistent props', async () => {
  const importedDeps = await attemptImport(sampleImportPath, [
    'missingProp1',
    'missingProp2',
  ]);

  assertEquals(importedDeps.length, 0);
});

Deno.test('Should get only existent imports', async () => {
  const importedDeps = await attemptImport(sampleImportPath, [
    'missingProp1',
    'testFunc1',
  ]);

  console.log(importedDeps[0].name);

  assertEquals(importedDeps.length, 1);
  assertEquals(importedDeps[0].name, 'testFunc1');
});

Deno.test('Should get all imports, when no props are specified', async () => {
  const importedDeps = await attemptImport(sampleImportPath);

  assertEquals(importedDeps.length, 2);
  assertEquals(importedDeps[0].name, 'testFunc1');
  assertEquals(importedDeps[1].name, 'testFunc2');
});

Deno.test(
  'Should get all imports, when empty array of props are specified',
  async () => {
    const importedDeps = await attemptImport(sampleImportPath, []);

    assertEquals(importedDeps.length, 2);
    assertEquals(importedDeps[0].name, 'testFunc1');
    assertEquals(importedDeps[1].name, 'testFunc2');
  }
);

Deno.test('Should get specified imports', async () => {
  const importedDeps = await attemptImport(sampleImportPath, ['testFunc1']);

  assertEquals(importedDeps.length, 1);
  assertEquals(importedDeps[0].name, 'testFunc1');
});
