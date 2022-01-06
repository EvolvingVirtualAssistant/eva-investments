import { TextEncoder, readline } from '../deps';

export async function print(message = ''): Promise<void> {
  const msg = new TextEncoder().encode(message);
  await process.stdout.write(msg);
}

export async function println(message = ''): Promise<void> {
  await print(message + '\n');
}

export async function readln(): Promise<string> {
  return '';
}

/*async function readMessage(): Promise<string> {
    const buf = new Uint8Array(1024)
    const nBytesRead = <number>await Deno.stdin.read(buf)
    return new TextDecoder().decode(buf.subarray(0, nBytesRead)).trim()
}*/
