// Best advice I ever got — one-line entry publisher.
// The entry itself is a piece of advice my father actually gave me, word for
// word as I remember it. The publisher below only carries it to the output
// file; it never edits the text, it only checks it fits the competition.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const CONFIG = Object.freeze({
  fileName: "entry.txt",
  maxChars: 200,
  minChars: 10,
});

const ADVICE =
  "My dad always said: never make a big decision when you're hungry, angry, or tired. Thirty years later, I still haven't found an exception.";

function outputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!dir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  return dir;
}

function checkLength(text: string): void {
  if (text.length < CONFIG.minChars || text.length > CONFIG.maxChars) {
    throw new Error(`entry is ${text.length} chars, must be ${CONFIG.minChars}-${CONFIG.maxChars}`);
  }
  if (!text.trim()) throw new Error("entry must not be blank");
  if (!/[.!?]$/.test(text.trim())) throw new Error("entry should end with punctuation");
}

class AdvicePublisher {
  private readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  build(): string {
    checkLength(this.text);
    return this.text;
  }

  async publish(): Promise<string> {
    const dir = outputDir();
    const target = join(dir, CONFIG.fileName);
    await mkdir(dir, { recursive: true });
    await writeFile(target, this.build(), "utf8");
    return target;
  }
}

const publisher = new AdvicePublisher(ADVICE);
await publisher.publish();
