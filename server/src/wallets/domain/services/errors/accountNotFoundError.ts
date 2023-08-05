class AccountNotFoundError extends Error {
  constructor(chainId: string, address: string) {
    super(
      `Could not find account in chain ${chainId} with address: ${address}.`
    );
  }
}

export default AccountNotFoundError;
