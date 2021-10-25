export class MockClass {
  private field1: string;
  private parsedArgs: any[];
  private fallbackCalled: boolean;
  private fallbackErrMsg: string;

  constructor(arg1: string) {
    this.field1 = arg1;
    this.parsedArgs = [];
    this.fallbackCalled = false;
    this.fallbackErrMsg = '';
  }

  getField1() {
    return this.field1;
  }

  fallback(errMsg: string) {
    this.fallbackCalled = true;
    this.fallbackErrMsg = errMsg;
  }

  receiveParsedArgs(arg1: any, arg2: any, arg3: any, arg4: any, arg5: any) {
    this.parsedArgs = [arg1, arg2, arg3, arg4, arg5];
  }

  getParsedArgs(): any[] {
    return this.parsedArgs;
  }

  varArgs(...args: any[]) {}

  optionalArgs(arg1: string, arg2?: string) {}

  defaultArgs(arg1: string, arg2 = 'default_value') {}

  getFallbackCalled(): boolean {
    return this.fallbackCalled;
  }

  getFallbackErrMsg(): string {
    return this.fallbackErrMsg;
  }
}
