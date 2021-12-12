import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { isType } from '../../../src/utils/typeGuards.ts';

class MockClass {
  private field1: string | null = null;
  private field2: boolean | null = null;
  private field3: number | null = null;
  private field4?: number;
}

const mockObj = new MockClass();

Deno.test('Should not be of type with missing required field', () => {
  assertEquals(
    isType(
      { field1: '', field3: '' },
      ['field1', 'field2', 'field3'],
      ['field4']
    ),
    false
  );
});

Deno.test('Should not be of type with extra field', () => {
  assertEquals(
    isType(
      { ...mockObj, field5: '' },
      ['field1', 'field2', 'field3'],
      ['field4']
    ),
    false
  );
});

Deno.test(
  'Should not be of type with required fields filled with undefined value',
  () => {
    assertEquals(
      isType(
        { ...mockObj, field1: undefined },
        ['field1', 'field2', 'field3'],
        ['field4']
      ),
      false
    );
  }
);

Deno.test('Should be of type', () => {
  assertEquals(
    isType(mockObj, ['field1', 'field2', 'field3'], ['field4']),
    true
  );
});
