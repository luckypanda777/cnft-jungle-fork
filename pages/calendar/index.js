import { NextSeo } from 'next-seo';
import dynamic from 'next/dynamic';

const Collections = dynamic(() => import('components/Collections'), {
  ssr: false,
});

export async function getServerSideProps() {
  return {
    props: {},
  };
}

function Calendar(props) {
  const SEO = {
    title: 'CNFT Jungle - Upcoming CNFT drop calendar',
    description: 'Upcoming CNFT drop calendar',
    additionalMetaTags: [
      {
        name: 'keywords',
        content:
          'upcoming,drop,calendar,cnft,rarity,database,score,nft,cardano,jungle',
      },
    ],
  };

  return (
    <>
      <NextSeo {...SEO} />
      <Collections calendar {...props} />
    </>
  );
}

export default Calendar;
