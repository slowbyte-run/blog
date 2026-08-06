import metascraper from 'metascraper';
import metascraperDescription from 'metascraper-description';
import metascraperImage from 'metascraper-image';
import metascraperLogo from 'metascraper-logo';
import metascraperTitle from 'metascraper-title';
import metascraperUrl from 'metascraper-url';
import metascraperLogoFavicon from 'metascraper-logo-favicon';
import type { OGData } from './types';

const scraper = metascraper([
  metascraperDescription(),
  metascraperImage(),
  metascraperLogo(),
  metascraperTitle(),
  metascraperUrl(),
  metascraperLogoFavicon(),
]);

export async function fetchOGData(url: string): Promise<OGData> {
  const TIMEOUT_MS = 5000;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Link Embed] Failed to fetch ${url}: ${response.status}`);
      return {
        originUrl: url,
        url,
        error: `Failed to fetch: ${response.status}`,
      };
    }

    const html = await response.text();
    const metadata = await scraper({ html, url });

    return {
      originUrl: url,
      url: metadata.url || url,
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      logo: metadata?.logo || metadata?.favicon,
      author: metadata?.author || metadata?.publisher,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`[Link Embed] Timeout fetching ${url}`);
      return {
        originUrl: url,
        url,
        error: 'Request timeout',
      };
    }
    console.warn(`[Link Embed] Error fetching ${url}:`, error);
    return {
      originUrl: url,
      url,
      error: error instanceof Error ? error.message : 'Failed to fetch',
    };
  }
}
