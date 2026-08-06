import type { LayoutFooterData } from '@/lib/layout/footer-data';
import Footer from './Footer';
import PostFooter from '../post/PostFooter';

type Props = LayoutFooterData;

export default function LayoutFooter({ postFooter, stats }: Props) {
  return (
    <>
      <PostFooter {...postFooter} />
      <Footer stats={stats} />
    </>
  );
}
