/**
 * Remark 链接嵌入插件
 * 将独立链接转换为 Tweet/CodePen/OG 预览。
 */

import { visit } from 'unist-util-visit';
import type { Root, Paragraph, Link } from 'mdast';
import type { Parent } from 'unist';
import { classifyLink, isStandaloneLinkParagraph } from './link-utils';
import { fetchOGData } from './remark-link-embed/fetch-og';
import {
  generateCodePenEmbedHTML,
  generateLinkPreviewHTML,
} from './remark-link-embed/html';
import type { RemarkLinkEmbedOptions } from './remark-link-embed/types';

export function remarkLinkEmbed(options: RemarkLinkEmbedOptions = {}) {
  const {
    enableTweetEmbed = true,
    enableCodePenEmbed = true,
    enableOGPreview = true,
  } = options;

  return async function (tree: Root) {
    const nodesToReplace: Array<{
      node: Paragraph;
      index: number;
      parent: Parent;
      url: string;
      type: string;
      tweetId?: string;
      codepen?: {
        user: string;
        penId: string;
      };
    }> = [];

    visit(tree, 'paragraph', (node: Paragraph, index, parent) => {
      if (index === undefined || !parent) return;

      if (isStandaloneLinkParagraph(node)) {
        const linkNode = node.children[0] as Link;
        const url = linkNode.url;
        const linkInfo = classifyLink(url);

        nodesToReplace.push({
          node,
          index,
          parent,
          url,
          type: linkInfo.type,
          tweetId: linkInfo.tweetId,
          codepen: linkInfo.codepen,
        });
      }
    });

    const fetchPromises = nodesToReplace.map(
      async ({ url, type, tweetId, codepen }) => {
        if (type === 'tweet' && enableTweetEmbed && tweetId) {
          return {
            type: 'html' as const,
            value: `<div data-tweet-embed data-tweet-id="${tweetId}"></div>`,
          };
        }

        if (type === 'codepen' && enableCodePenEmbed && codepen) {
          const html = generateCodePenEmbedHTML(
            codepen.user,
            codepen.penId,
            url,
          );
          return { type: 'html' as const, value: html };
        }

        if (type === 'general' && enableOGPreview) {
          const ogData = await fetchOGData(url);
          const html = generateLinkPreviewHTML(ogData);
          return { type: 'html' as const, value: html };
        }

        return null;
      },
    );

    const embedNodes = await Promise.all(fetchPromises);

    nodesToReplace.forEach(({ index, parent }, i) => {
      const embedNode = embedNodes[i];
      if (embedNode) {
        parent.children[index] = embedNode;
      }
    });
  };
}

export default remarkLinkEmbed;
