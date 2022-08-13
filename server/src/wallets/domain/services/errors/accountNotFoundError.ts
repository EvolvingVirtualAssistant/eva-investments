class AccountNotFoundError extends Error {
  constructor(chainId: number, address: string) {
    super(
      `Could not find account in chain ${chainId} with address: ${address}.`
    );
  }
}

export default AccountNotFoundError;
