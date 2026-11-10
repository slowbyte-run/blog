/** 线上可见性判定，纯函数，便于测试。 */
export type Visibility = 'public' | 'restricted' | 'missing' | 'pending';

export interface VisibilityResult {
  visibility: Visibility;
  detail: string;
}

/**
 * 博客园的公开地址对「审核中 / 私有」随笔会 302 到登录页，
 * 已删除或尚未发布则是 404。
 */
export function classifyVisibility(
  status: number,
  location: string | null | undefined,
): VisibilityResult {
  if (status === 200) return { visibility: 'public', detail: '200' };

  if (status >= 300 && status < 400) {
    const target = location ?? '';
    const where = target.includes('signin') ? 'signin' : target.slice(0, 60);
    return { visibility: 'restricted', detail: `${status} -> ${where}` };
  }

  return { visibility: 'missing', detail: String(status) };
}
