import { readLines } from "https://deno.land/std/io/mod.ts";

export async function print(message = ""): Promise<void> {
    await Deno.stdout.write(new TextEncoder().encode(message))
}

export async function println(message = ""): Promise<void> {
    await print(message+"\n");
}

export async function readln() {
    for await(const line of readLines(Deno.stdin)) {
        return line.trim();
    }
}

/*async function readMessage(): Promise<string> {
    const buf = new Uint8Array(1024)
    const nBytesRead = <number>await Deno.stdin.read(buf)
    return new TextDecoder().decode(buf.subarray(0, nBytesRead)).trim()
}*/