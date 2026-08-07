// Home / BlogIndex Config
export const homePageProfile = {
  name: 'slowbyte',
  tagline: '“slow byte, steady build”',
  avatarUrl: '/img/avatar.webp',
  avatarAlt: 'slowbyteAvatar',
  backgroundUrl: '/img/site_header_1920.webp',
  footerText: '© slowbyte - 2026',
};

export const homePageLinks = {
  xUrl: 'https://x.com/slowbyte9124',
  githubUrl: 'https://github.com/slowbyte-run',
  cnblogsUrl: 'https://www.cnblogs.com/slowbyte',
};

export async function getHomePageProfile() {
  const { getBackgroundImages } = await import('@lib/backgrounds');
  const backgroundImages = await getBackgroundImages();
  const backgroundUrl = backgroundImages.length
    ? backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    : homePageProfile.backgroundUrl;

  return { ...homePageProfile, backgroundUrl };
}
