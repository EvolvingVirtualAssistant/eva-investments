import { ContractAbi } from '../../../../deps';

class ContractContentMissingError extends Error {
  constructor(
    contractPath: string,
    contractName: string,
    contractJson: string,
    contractByteCode: string,
    abi: ContractAbi
  ) {
    super(
      `Could not load contract ${contractName} (found in ${contractPath}) successfully. 
      contractJson exists: ${!!contractJson} , contractByteCode exists: ${!!contractByteCode} , abi exists: ${!!abi}`
    );
  }
}

export default ContractContentMissingError;
