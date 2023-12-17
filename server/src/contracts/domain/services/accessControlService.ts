import { getExternalDeps } from '../../../appContext';

export async function getParticipants(
  chainId: string,
  contractAddress: string,
  ownerAddress: string
): Promise<string[]> {
  return await getExternalDeps().getParticipants(
    chainId,
    contractAddress,
    ownerAddress
  );
}

export async function addParticipant(
  chainId: string,
  contractAddress: string,
  participantAddress: string,
  ownerAddress: string,
  maxPriorityFeePerGas?: string
): Promise<void> {
  await getExternalDeps().addParticipant(
    chainId,
    contractAddress,
    participantAddress,
    ownerAddress,
    maxPriorityFeePerGas
  );
}

export async function removeParticipant(
  chainId: string,
  contractAddress: string,
  participantAddress: string,
  ownerAddress: string,
  maxPriorityFeePerGas?: string
): Promise<void> {
  await getExternalDeps().removeParticipant(
    chainId,
    contractAddress,
    participantAddress,
    ownerAddress,
    maxPriorityFeePerGas
  );
}

export async function transferOwnership(
  chainId: string,
  contractAddress: string,
  ownerAddress: string,
  newOwnerAddress: string,
  maxPriorityFeePerGas?: string
): Promise<void> {
  await getExternalDeps().transferOwnership(
    chainId,
    contractAddress,
    ownerAddress,
    newOwnerAddress,
    maxPriorityFeePerGas
  );
}
