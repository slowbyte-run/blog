import { afterEach, describe, expect, it } from 'vitest';

import { parseArgs } from '../scripts/lib/summaries/utils';

const originalArgv = process.argv;

function argv(...args: string[]) {
  process.argv = ['node', 'generateSummaries.ts', ...args];
}

describe('summary script args', () => {
  afterEach(() => {
    process.argv = originalArgv;
  });

  it('defaults to no probe so normal runs stay description-first', () => {
    argv();

    const { probe, model, force } = parseArgs('deepseek-flash');

    expect(probe).toBe(0);
    expect(model).toBe('deepseek-flash');
    expect(force).toBe(false);
  });

  it('reads an explicit probe count', () => {
    argv('--probe', '3');

    expect(parseArgs('m').probe).toBe(3);
  });

  it('falls back to 3 when --probe has no usable count', () => {
    argv('--probe');
    expect(parseArgs('m').probe).toBe(3);

    argv('--probe', '--force');
    expect(parseArgs('m').probe).toBe(3);

    argv('--probe', '0');
    expect(parseArgs('m').probe).toBe(3);
  });

  it('keeps parsing other flags after a probe count', () => {
    argv('--probe', '2', '--model', 'custom-model', '--force');

    const { probe, model, force } = parseArgs('fallback');

    expect(probe).toBe(2);
    expect(model).toBe('custom-model');
    expect(force).toBe(true);
  });
});
