import { TextEncoder, readline } from '../deps';

export async function print(message = ''): Promise<void> {
  await process.stdout.write(new TextEncoder().encode(message));
}

export async function println(message = ''): Promise<void> {
  await print(message + '\n');
}

export async function readln(): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin });
  rl.on('SIGINT', () => {
    rl.close();
  });

  for await (const line of rl) {
    return line.trim();
  }

  rl.close();

  return '';
}

/*async function readMessage(): Promise<string> {
    const buf = new Uint8Array(1024)
    const nBytesRead = <number>await Deno.stdin.read(buf)
    return new TextDecoder().decode(buf.subarray(0, nBytesRead)).trim()
}*/
