// pages/server-sitemap.xml/index.tsx

import { getServerSideSitemap } from 'next-sitemap';
import axios from 'axios';
import { API_URL } from '../../src/config';

const headers = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent': '*',
  'x-api-key': process.env.NEXT_PUBLIC_REACT_APP_API_KEY || '',
};

const trendingParams = {
  page: 1,
  perPage: 500,
  type: 'volume',
};

const topParams = {
  page: 1,
  perPage: 500,
  sort: 'floor',
  sortDirection: 'desc',
};

export const getServerSideProps = async (ctx) => {
  const trendingCollections = await axios.get(`${API_URL}/trending`, {
    params: trendingParams,
    headers,
  });

  const topCollections = await axios.get(`${API_URL}/collections`, {
    params: topParams,
    headers,
  });

  const collections = [
    ...topCollections.data.collections,
    ...trendingCollections.data.trending,
  ];

  const uniqueFields = collections.reduce((acc, curr) => {
    if (!acc.some((item) => item.policies === curr.policies)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const fields = uniqueFields.map((c) => ({
    loc: `https://cnftjungle.io/collections/${c.policies}`,
    lastmod: new Date().toISOString(),
  }));

  return getServerSideSitemap(ctx, fields);
};

export default function Sitemap() {}
