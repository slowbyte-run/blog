import type { MarkdownHeading } from '@/types/markdown';
import type { Heading } from '../useHeadingTree';

type HeadingSource = {
  id: string;
  text: string;
  level: number;
};

type HeadingInput = HeadingSource | MarkdownHeading;

export const EMPTY_HEADINGS: Heading[] = [];

export function buildHeadingTree(flatHeadings: HeadingSource[]): Heading[] {
  const tree: Heading[] = [];
  const stack: Heading[] = [];

  flatHeadings.forEach((heading) => {
    const newHeading: Heading = { ...heading, children: [] };

    while (
      stack.length > 0 &&
      stack[stack.length - 1].level >= newHeading.level
    ) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(newHeading);
    } else {
      const parent = stack[stack.length - 1];
      parent.children.push(newHeading);
      newHeading.parent = parent;
    }

    stack.push(newHeading);
  });

  return tree;
}

export function normalizeHeadingInputs(
  headings?: HeadingInput[],
): HeadingSource[] {
  if (!headings) return [];

  return headings.map((heading) => {
    if ('depth' in heading) {
      return {
        id: heading.slug,
        text: heading.text,
        level: heading.depth,
      };
    }

    return heading;
  });
}

export type { HeadingInput, HeadingSource };
