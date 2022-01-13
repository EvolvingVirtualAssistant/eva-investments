export function test(testName: string, fn: () => any) {
  it(testName, fn);
}

export function testParameterized(
  params: any[][],
  testName: string,
  fn: (...args: any[]) => any
) {
  it.each(params)(testName, fn);
}

export function fail(msg?: string) {
  throw new Error(`Fail ${msg || ''}`);
}

export function assertEquals(actual: unknown, expected: unknown, msg?: string) {
  try {
    expect(actual).toStrictEqual(expected);
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}

// https://deno.land/std@0.119.0/testing/asserts.ts -> assertThrows
export function assertThrows<E extends Error = Error>(
  fn: () => unknown,
  ErrorClass?: new (...args: any[]) => E,
  msgIncludes?: string,
  msg?: string
) {
  try {
    fn();
  } catch (e) {
    if (ErrorClass != null) {
      if (e instanceof ErrorClass) {
        if (msgIncludes != null && !e.message.includes(msgIncludes)) {
          throw new Error(
            `${msgIncludes} is not included in error message ${e.message}`
          );
        }
      } else {
        throw new Error(`${e} is not of type ${ErrorClass}`);
      }
    }

    return;
  }

  throw new Error(msg || 'Fail on assertThrows');
}

export function assertArrayIncludes(
  actual: unknown[],
  expected: unknown[],
  msg?: string
) {
  try {
    expect(actual).toEqual(expect.arrayContaining(expected));
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}
