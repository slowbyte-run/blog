import Giscus from '@giscus/react';
import { useIsDarkTheme } from '@hooks/index';

export default function GiscusComments() {
  const isDarkTheme = useIsDarkTheme();
  const theme = isDarkTheme ? 'dark' : 'light';

  return (
    <div className="w-full pb-12">
      <Giscus
        id="comments"
        repo="slowbyte-run/blog"
        repoId="R_kgDOTvV9dw"
        category="General"
        categoryId="DIC_kwDOTvV9d84DCx5a"
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="zh-CN"
        loading="lazy"
      />
    </div>
  );
}
