type BlogLayoutConfig = {
  title: string;
  alternate?: string;
  subtitle?: string;
  name: string;
  description?: string;
  avatar?: string;
  showLogo?: boolean;
  author?: string;
  site: string;
  startYear?: number;
  keywords?: string[];
  banner: {
    src: string;
    srcset: string;
    lqipSrc: string;
    alt?: string;
  };
};

type SocialPlatform = {
  url: string;
  label: string;
  iconText: string;
  iconClass?: string; // Font Awesome icon class
  color: string;
};

type SocialConfig = {
  github?: SocialPlatform;
  x?: SocialPlatform;
  email?: SocialPlatform;
  telegram?: SocialPlatform;
  bilibili?: SocialPlatform;
};

export const blogLayoutConfig: BlogLayoutConfig = {
  title: 'slowbyteのblog',
  alternate: 'slowbyte',
  subtitle: 'slow byte, steady build',
  name: 'slowbyte',
  description: 'Code · Learn · Grow 🔄',
  avatar: '/img/Camera_XHS_17721581668191040g00831aac0imtn20g5oe96bg418vjsfgi9o0_edit_2666894832384741.jpg',
  showLogo: true,
  author: 'slowbyte',
  site: 'https://blog.novaspace.me/',
  startYear: 2026,
  keywords: ['slowbyte', 'acmer', 'archlinux', 'backend', 'blog'],
  banner: {
    src: '/img/site_header_1920.webp',
    srcset: '/img/site_header_800.webp 800w,/img/site_header_1920.webp 1200w',
    lqipSrc: '/img/site_header_1920.webp',
    alt: 'cover',
  },
};

export const blogSocialConfig: SocialConfig = {
  github: {
    url: 'https://github.com/slowbyte-run',
    label: 'GitHub',
    iconText: 'GH',
    iconClass: 'fa-brands fa-github',
    color: '#191717',
  },
  x: {
    url: 'https://x.com/slowbyte9124',
    label: 'X (推特)',
    iconText: 'X',
    iconClass: 'fa-brands fa-x-twitter',
    color: '#4b9ae4',
  },
  email: {
    url: 'mailto:slowbyte.run@gmail.com',
    label: 'Email',
    iconText: '@',
    iconClass: 'fa-regular fa-envelope',
    color: '#55acd5',
  },
  telegram: {
    url: '#',
    label: 'Telegram',
    iconText: 'TG',
    iconClass: 'fa-brands fa-telegram',
    color: '#229ed9',
  },
  bilibili: {
    url: '#',
    label: '哔哩哔哩',
    iconText: 'B',
    iconClass: 'fa-brands fa-bilibili',
    color: '#00a1d6',
  },
};

const { title, alternate, subtitle } = blogLayoutConfig;

export const blogSeoConfig = {
  title: `${alternate ? alternate + ' = ' : ''}${title}${subtitle ? ' = ' + subtitle : ''}`,
  description: blogLayoutConfig.description,
  keywords: blogLayoutConfig?.keywords?.join(',') ?? '',
  url: blogLayoutConfig.site,
};

export const defaultCoverList = Array.from(
  { length: 13 },
  (_, index) => index + 1,
).map((item) => `/img/cover/${item}.webp`);
