export type TokenAllowance = {
  tokenAddress: string;
  amount: string;
  toAddress: string;
  block: number;
};

export type TokenAllowances = {
  tokenAddress: string;
  allowances: TokenAllowance[];
};
