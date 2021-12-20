class AccountNotFoundError extends Error {
  constructor(address: string) {
    super(
      `Could not find account with address: ${address}.`,
    );
  }
}

export default AccountNotFoundError;
