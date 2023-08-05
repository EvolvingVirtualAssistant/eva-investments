export type TokenAllowance = {
  tokenAddress: string | undefined;
  amount: string | undefined;
  toAddress: string | undefined;
  block: bigint;
};

export type TokenAllowances = {
  tokenAddress: string;
  allowances: TokenAllowance[];
};
