export interface OGData {
  originUrl: string;
  url: string;
  title?: string;
  description?: string;
  image?: string;
  logo?: string;
  error?: string;
  author?: string;
}

export interface RemarkLinkEmbedOptions {
  enableTweetEmbed?: boolean;
  enableCodePenEmbed?: boolean;
  enableOGPreview?: boolean;
}
