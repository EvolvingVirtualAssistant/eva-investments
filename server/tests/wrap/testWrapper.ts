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
  errorClass?: new (...args: any[]) => E,
  msgIncludes?: string,
  msg?: string
) {
  try {
    fn();
  } catch (e) {
    assertThrowsErrorHandler(e, errorClass, msgIncludes);
    return;
  }

  throw new Error(msg || 'Fail on assertThrows');
}

function assertThrowsErrorHandler<E extends Error = Error>(
  e: unknown,
  errorClass?: new (...args: any[]) => E,
  msgIncludes?: string
) {
  if (errorClass != null) {
    if (e instanceof errorClass) {
      if (msgIncludes != null && !e.message.includes(msgIncludes)) {
        throw new Error(
          `${msgIncludes} is not included in error message ${e.message}`
        );
      }
    } else {
      throw new Error(`${e} is not of type ${errorClass}`);
    }
  }
}

export async function assertThrowsAsync<E extends Error = Error>(
  fn: () => unknown,
  errorClass?: new (...args: any[]) => E,
  msgIncludes?: string,
  msg?: string
) {
  try {
    await fn();
  } catch (e) {
    assertThrowsErrorHandler(e, errorClass, msgIncludes);
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

export function assertNull(actual: unknown, msg?: string) {
  try {
    expect(actual).toBeNull();
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}

export function assertNotNull(actual: unknown, msg?: string) {
  try {
    expect(actual).not.toBeNull();
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}

export function assertUndefined(actual: unknown, msg?: string) {
  try {
    expect(actual).toBeUndefined();
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}

export function assertNotUndefined(actual: unknown, msg?: string) {
  try {
    expect(actual).not.toBeUndefined();
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}
//still missing
//toBeLessThan
//toBeGreaterThanOrEqual
export function assertToBeGreaterThan(
  actual: number | bigint,
  expected: number | bigint,
  msg?: string
) {
  try {
    expect(actual).toBeGreaterThan(expected);
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}

export function assertToBeLessThanOrEqual(
  actual: number | bigint,
  expected: number | bigint,
  msg?: string
) {
  try {
    expect(actual).toBeLessThanOrEqual(expected);
  } catch (e) {
    if (msg == null) {
      throw e;
    }

    throw new Error(msg);
  }
}
