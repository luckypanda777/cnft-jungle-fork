import Assets from 'components/Assets';
import { API_URL } from '../../src/config';
import axios from 'axios';
import { NextSeo } from 'next-seo';
import { useAppContext } from '../../src/context/AppContext';
import { useEffect } from 'react';

const headers = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent': '*',
  'x-api-key': process.env.NEXT_PUBLIC_REACT_APP_API_KEY || '',
};

export async function getServerSideProps(ctx) {
  const { collection } = ctx.params;

  let data = null;

  const params = {
    page: 1,
    perPage: 0,
    sort: 'assetNumber',
    sortDirection: 'asc',
    traitFilterLogic: 'intersection',
  };

  try {
    const resp = await axios.get(`${API_URL}/collections/${collection}`, {
      params,
      headers,
    });

    data = resp.data;
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      collection,
      collectionData: data,
    },
  };
}

const Collection = ({ collection, collectionData }) => {
  const { setCollection } = useAppContext();
  const collectionId = collectionData?.collection.id || '';
  const collectionName = collectionData?.collection.collection_name || '';
  const collectionPolicy = collectionData?.collection.policies;
  const collectionDescription = collectionData?.collection.description;
  const collectionImg = collectionData?.collection.image;

  // new seoo
  const SEO = {
    title: `${collectionName} | CNFT Jungle`,
    canonical: `https://www.cnftjungle.io/collections/${collectionPolicy}`,
    description: `Collection ${
      collectionName || collectionPolicy
    } asset ranking, trait explorer and collection analytics.`,
    openGraph: {
      images: [
        {
          url: collectionImg,
          width: 800,
          height: 600,
          alt: 'img',
        },
      ],
      title: `${collectionName} | CNFT Jungle`,
    },
    twitter: {
      handle: '@CNFTJungle',
      site: `https://cnftjungle.io/collections/${collectionPolicy}`,
      cardType: 'summary',
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: `${collectionName} rarity, ${collectionName} volume, ${collectionName} analytics, cnft, rarity, volume, floor, floor price, traits, database, score, nft, assets, cardano, jungle, ${collectionName}, ${collectionPolicy}`,
      },
    ],
  };

  useEffect(() => {
    if (collectionData && collectionData.collection) {
      setCollection(collectionData.collection);
    }
  }, []);

  return (
    <>
      <NextSeo {...SEO} />
      <Assets collection={collection} collectionData={collectionData} />
    </>
  );
};
export default Collection;
