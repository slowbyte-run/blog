export interface FriendLink {
  site: string;
  url: string;
  owner: string;
  desc: string;
  image: string;
  color?: string;
}

export const friendsData: FriendLink[] = [
  {
    site: '柚子网站',
    url: 'https://www.hxyouzi.com/blog/',
    owner: '柚子',
    desc: '长风破浪会有时，直观云帆济沧海！！！',
    image: 'https://www.hxyouzi.com/fs/avater/1766993232_打伞少女.jpg',
    color: '#ec66ab',
  },
  {
    site: '柠记茶楼',
    url: 'https://blog.lemonice.top',
    owner: '冷柠',
    desc: '临安初雨，一夜落红。',
    image: 'https://blog.lemonice.top/img/avatar.webp',
    color: '#e0edff',
  },
  {
    site: 'SheepChef Blog',
    url: 'https://shef.cc/',
    owner: 'SheepChef',
    desc: '蒼穹を越えて',
    image: 'https://shef.cc/logo.png',
    color: '#5c67e6',
  },
  {
    site: 'Hakadao',
    url: 'https://hakadao.cc',
    owner: 'Hakadao',
    desc: 'Now I am become a loser, the destroyer of myself.',
    image: 'https://avatars.githubusercontent.com/u/33394391?v=4&s=100',
    color: '#0e0f1a',
  },
  {
    site: "Elykia's Blog",
    url: 'https://blog.elykia.cn/',
    owner: 'Elykia',
    desc: '致以无瑕之人',
    image: 'https://bu.dusays.com/2024/10/25/671b2438203a6.gif',
    color: '#ebb4ff',
  },
  {
    site: "HalfSweet's Blog",
    url: 'https://blog.halfsweet.cn/',
    owner: '半糖',
    desc: 'Try to create some value',
    image: 'https://blog.halfsweet.cn/img/Headshot.jpg',
    color: '#ebb4ff',
  },
  {
    site: 'Guoweiyi',
    url: 'https://gwy.fun/',
    owner: 'Guoweiyi',
    desc: '不知何时春日悄来临，\n' + '不知何日春花已落尽。',
    image:
      'https://gwy.fun/_next/image?url=https%3A%2F%2Fwww.gwy.fun%2Fzhan%2Flogo.jpg&w=640&q=75',
    color: '#98abff',
  },
  {
    site: "RainbowBird'S Blog",
    url: 'https://blog.luoling.moe/',
    owner: 'RainbowBird',
    desc: '以梦为马，不负韶华。',
    image: 'https://blog.luoling.moe/images/avatar.jpg',
    color: '#063',
  },
  {
    site: 'hsn的博客',
    url: 'https://www.zh314.xyz/',
    owner: 'hsn',
    desc: '是想长头发但是还在敲代码的hsn!',
    image: 'https://avatars.githubusercontent.com/u/51445446?v=4',
    color: '#a172ff',
  },
  {
    site: '凌菀喵',
    url: 'https://nyac.at/',
    owner: 'clansty',
    desc: '你好，这里是凌菀',
    image: 'https://avatars.githubusercontent.com/u/18461360?v=4',
    color: '#93b7f6',
  },
  {
    site: "HSn's Blog",
    url: 'https://blog.huangsn.dev',
    owner: 'HSn',
    desc: '人在北极，彻底失败',
    image: 'https://avatars.githubusercontent.com/u/91785709?v=4',
    color: '#f8ffc2',
  },
  {
    site: '李嘉图的博客',
    url: 'https://gogec.cn/',
    owner: '李嘉图',
    desc: '努力想得到什么东西，其实只要沉着冷静坚持不懈，就可以轻易神不知鬼不觉的得到。',
    image: 'https://gogec.cn/assets/ckg-Dsi84xWE.jpg',
    color: '#393535',
  },
  {
    site: '余弦の博客',
    url: 'https://blog.cosine.ren/',
    owner: 'cosine',
    desc: '=WA的一声就哭了',
    image: 'https://blog.cosine.ren/img/avatar.webp',
  },
  {
    site: '阿凯的博客',
    url: 'https://salephine.asia/',
    owner: '阿凯',
    desc: '生如逆旅单行道，哪有岁月可回头。',
    image: 'https://avatars.githubusercontent.com/u/84063341?v=4',
    color: '#1c8adb',
  },
];

export const friendsIntro = {
  title: '小伙伴们',
  subtitle: '收录我的一众小伙伴',
  applyTitle: '欢迎加友链',
  applyDesc: '在本页留言,格式如下',
  exampleYaml: `- site: slowbyteのblog # 站点名称
  url: https://blog.novaspace.me/
  owner: slowbyte
  desc: slow byte, steady build
  image: https://blog.novaspace.me/img/avatar.webp
  color: "#ffc0cb" # 图标色`,
};
