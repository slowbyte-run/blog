// Home / BlogIndex Config
export const homePageProfile = {
  name: 'slowbyte',
  tagline: '“slow byte, steady build”',
  avatarUrl: '/img/Camera_XHS_17721581668191040g00831aac0imtn20g5oe96bg418vjsfgi9o0_edit_2666894832384741.jpg',
  avatarAlt: 'slowbyteAvatar',
  backgroundUrl: '/img/site_header_1920.webp',
  footerText: '© slowbyte - 2026',
};

export const homePageLinks = {
  xUrl: '#',
  githubUrl: 'https://github.com/slowbyte-run',
  telegramUrl: '#',
  bilibiliUrl: '#',
};

export async function getHomePageProfile() {
  const { getBackgroundImages } = await import('@lib/backgrounds');
  const backgroundImages = await getBackgroundImages();
  const backgroundUrl = backgroundImages.length
    ? backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
    : homePageProfile.backgroundUrl;

  return { ...homePageProfile, backgroundUrl };
}
