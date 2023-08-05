export interface Block {
  number: bigint;
  baseFeePerGas: bigint;
  gasLimit: bigint;
  gasUsed: bigint;
  transactionsHashes: string[];
}
