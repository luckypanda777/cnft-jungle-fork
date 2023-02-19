import Footer from 'components/layout/Footer';
import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

const PromotionView = dynamic(() => import('views/Promotion'), {
  ssr: false,
});

const SEO = {
  title: 'CNFT Jungle - Promote your project',
  description: 'Let the whole jungle know about your project',
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'cnft,promotion,advertising,drop,calendar,cnft,upcoming',
    },
  ],
};

function Promotion() {
  return (
    <>
      <NextSeo {...SEO} />
      <PromotionView />
      <Footer elements={['footer']} />
    </>
  );
}

export default Promotion;
