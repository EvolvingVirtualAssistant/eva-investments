export default class OpenApiSpecMissingPropertyError extends Error {
  constructor(spec: Record<string, any>, property: string) {
    super(`Missing property "${property}" on Open Api Schema: ${spec} .`);
  }
}
