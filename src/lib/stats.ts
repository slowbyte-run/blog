/**
 * 站点统计工具
 */

import readingTime from 'reading-time';
import { getVisibleBlogPosts } from './content/repository';

function formatWordCount(count: number): string {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}k`;
  }
  return count.toString();
}

function formatReadingTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

/**
 * 统计全站字数与阅读时长（生产环境自动排除草稿）
 */
export async function getSiteStats() {
  const posts = await getVisibleBlogPosts();

  let totalWords = 0;
  let totalMinutes = 0;

  for (const post of posts) {
    const content = post.body || '';
    const stats = readingTime(content);

    totalWords += stats.words;
    totalMinutes += Math.ceil(stats.minutes);
  }

  return {
    totalWords,
    totalMinutes,
    formattedWords: formatWordCount(totalWords),
    formattedTime: formatReadingTime(totalMinutes),
    postCount: posts.length,
  };
}
