import {
  assertArrayIncludes,
  assertEquals,
  test
} from '../../../../../wrap/testWrapper';
import getNonceTracker from '../../../../../../src/libs/blockchain-communication/domain/services/nonceTracker';
import { Web3Mock } from '../../mocks/web3Mock';

test('should generate unique nonces for one address', async () => {
  const { web3, mockGetTransactionCount } = Web3Mock();

  mockGetTransactionCount(() => {
    return Promise.resolve(1);
  });

  const address = 'mockAddress';
  const { initAddress, getNextNonce } = await getNonceTracker();

  // init address in NonceTracker
  await initAddress(web3, address);

  const nIterations = 30;

  const nonces: number[] = [];

  // create promises that use the nonce
  const promiseFns: (() => Promise<void>)[] = Array.from(
    Array(nIterations)
  ).map(() => {
    return async () => {
      const nonce = await getNextNonce(web3, address);
      nonces.push(nonce);
    };
  });

  // generate the expected nonces array
  const expectedNonces = Array.from(Array(nIterations)).map(
    (value, idx) => idx + 1
  );

  await Promise.allSettled(promiseFns.map((fn) => fn()));

  assertEquals(nonces.length, nIterations);
  assertArrayIncludes(nonces, expectedNonces);

  const highestNonce = Math.max(...nonces);

  assertEquals(highestNonce, nIterations);
});

test('should generate unique nonces in each address', async () => {
  const { web3, mockGetTransactionCount } = Web3Mock();

  const address1 = 'mockAddress1';
  const address2 = 'mockAddress2';
  const { initAddress, getNextNonce } = await getNonceTracker();

  // init address in NonceTracker
  mockGetTransactionCount(() => {
    return Promise.resolve(1);
  });
  await initAddress(web3, address1);

  // init address in NonceTracker
  mockGetTransactionCount(() => {
    return Promise.resolve(10);
  });
  await initAddress(web3, address2);

  const nIterations = 30;
  const halfNIterations = 15;

  const noncesAddress1: number[] = [];
  const noncesAddress2: number[] = [];

  // create promises that use the nonce
  const promiseFns: (() => Promise<void>)[] = Array.from(
    Array(nIterations)
  ).map((_, idx) => {
    return async () => {
      const isAddress1 = idx < halfNIterations ? true : false;
      const nonce = await getNextNonce(web3, isAddress1 ? address1 : address2);
      isAddress1 ? noncesAddress1.push(nonce) : noncesAddress2.push(nonce);
    };
  });

  // generate the expected nonces array
  const expectedNoncesAddress1 = Array.from(Array(halfNIterations)).map(
    (_, idx) => idx + 1
  );
  const expectedNoncesAddress2 = Array.from(Array(halfNIterations)).map(
    (_, idx) => 9 + idx + 1
  );

  await Promise.allSettled(promiseFns.map((fn) => fn()));

  assertEquals(noncesAddress1.length, halfNIterations);
  assertEquals(noncesAddress2.length, halfNIterations);
  assertArrayIncludes(noncesAddress1, expectedNoncesAddress1);
  assertArrayIncludes(noncesAddress2, expectedNoncesAddress2);

  const highestNonceAddress1 = Math.max(...noncesAddress1);
  const highestNonceAddress2 = Math.max(...noncesAddress2);

  assertEquals(highestNonceAddress1, halfNIterations);
  assertEquals(highestNonceAddress2, 9 + halfNIterations);
});
