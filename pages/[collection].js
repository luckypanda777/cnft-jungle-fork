import Assets from 'components/Assets';
import { NextSeo } from 'next-seo';
import axios from 'axios';
import { API_URL } from '../src/config';
import { useEffect } from 'react';
import { useAppContext } from '../src/context/AppContext';

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
    perPage: 1,
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
    return {
      notFound: true,
    };
  }

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      collection,
      collectionData: data,
    },
  };
}

const getSeo = (collectionData) => {
  let collectionName = '',
    collectionPolicy = '',
    collectionDescription = '',
    collectionImg = '';

  if (collectionData && collectionData.collection) {
    collectionName = collectionData.collection.collection_name;
    collectionPolicy = collectionData.collection.policies;
    collectionDescription = collectionData.collection.description;
    collectionImg = collectionData.collection.image;
  }

  return {
    title: `Collection ${collectionName} | CNFT Jungle`,
    canonical: `https://www.cnftjungle.io/collections/${collectionPolicy}`,
    description: `Collection ${
      collectionName || collectionPolicy
    } asset rankings, trait explorer and collection analytics.`,
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
      description: `${collectionDescription}`,
    },
    additionalMetaTags: [
      {
        name: 'keywords',
        content: `cnft rarity database score nft cardano jungle ${collectionName} ${collectionPolicy}`,
      },
    ],
  };
};

const Collection = ({ collection, collectionData }) => {
  const { setCollection } = useAppContext();
  const SEO = getSeo(collectionData);

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
