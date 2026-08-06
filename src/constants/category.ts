import transformShokaConfig from '@scripts/transformShokaConfig';

const shokaConfig = transformShokaConfig();

const fallbackCategoryMap: { [name: string]: string } = {
  技术教程: 'tech-tutorials',
};

// { '随笔': 'life' }
export const categoryMap: { [name: string]: string } = {
  ...fallbackCategoryMap,
  ...(shokaConfig?.categoryMap || {}),
};
