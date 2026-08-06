import { readdir } from 'node:fs/promises';

const backgroundsDir = new URL(
  '../../source/img/backgrounds/',
  import.meta.url,
);

export async function getBackgroundImages(): Promise<string[]> {
  try {
    const entries = await readdir(backgroundsDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.webp'))
      .map((entry) => `/img/backgrounds/${entry.name}`);
  } catch {
    return [];
  }
}
