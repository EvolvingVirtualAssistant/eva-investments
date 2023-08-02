export interface Block {
  number: number;
  baseFeePerGas: number;
  gasLimit: number;
  gasUsed: number;
  transactionsHashes: string[];
}
