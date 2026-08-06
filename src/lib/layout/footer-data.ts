import type { BlogPost } from '@/types/blog';
import { getRandomPosts, getPostIndexMap, getSortedPosts } from '@lib/content';
import { getRelatedPosts, hasSimilarityData } from '@lib/content/similarities';
import { getSiteStats } from '@lib/stats';

export type SiteStats = Awaited<ReturnType<typeof getSiteStats>>;

export interface PostFooterData {
  randomPosts: BlogPost[];
  relatedPosts: BlogPost[];
  hasSimilarityData: boolean;
  postIndexMap: Map<string, number>;
}

export interface LayoutFooterData {
  stats: SiteStats;
  postFooter: PostFooterData;
}

export async function getLayoutFooterData(
  post?: BlogPost,
): Promise<LayoutFooterData> {
  const [stats, postIndexMap, randomPosts] = await Promise.all([
    getSiteStats(),
    getPostIndexMap(),
    getRandomPosts(10),
  ]);

  const similarityAvailable = hasSimilarityData();
  let relatedPosts: BlogPost[] = [];

  if (similarityAvailable && post) {
    const allPosts = await getSortedPosts();
    relatedPosts = getRelatedPosts(post, allPosts, 5);
  }

  return {
    stats,
    postFooter: {
      randomPosts,
      relatedPosts,
      hasSimilarityData: similarityAvailable,
      postIndexMap,
    },
  };
}
