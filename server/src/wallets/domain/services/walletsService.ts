import { getExternalDeps } from '../../../appContext';

export async function createAccount(
  chainId: string,
  filePath: string,
  password: string
): Promise<void> {
  return await getExternalDeps().createAccount(chainId, filePath, password);
}

export async function recoverAccount(
  chainId: string,
  mnemonic: string,
  derivationPath: string,
  filePath: string,
  password: string
): Promise<void> {
  return await getExternalDeps().recoverAccount(
    chainId,
    mnemonic,
    derivationPath,
    filePath,
    password
  );
}
