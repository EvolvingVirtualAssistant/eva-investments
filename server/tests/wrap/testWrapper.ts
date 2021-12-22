export function test(testName: string, fn: () => void | Promise<void>) {}

export function fail(msg?: string) {}

export function assertEquals(
  actual: unknown,
  expected: unknown,
  msg?: string
) {}

export function assertThrows<T = void>(
  fn: () => T,
  ErrorClass?: typeof Error,
  msgIncludes = '',
  msg?: string
) {}

export function assertArrayIncludes(
  actual: unknown[],
  expected: unknown[],
  msg?: string
) {}
