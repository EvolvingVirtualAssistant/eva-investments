class SignatureBuilderMissingError extends Error {
  constructor(signatureId: string) {
    super(
      `Could not find Signature Builder instance for id: "${signatureId}".`,
    );
  }
}

export default SignatureBuilderMissingError;
