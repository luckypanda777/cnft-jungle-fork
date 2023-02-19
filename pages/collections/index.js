import Collections from 'components/Collections';
import { API_URL } from 'config';
import axios from 'axios';

export async function getServerSideProps(context) {
  let data = null;

  const params = {
    page: 1,
    perPage: 25,
    sort: 'timestamp_volume',
    sortDirection: 'desc',
    period: '1d',
  };

  try {
    const resp = await axios.get(`${API_URL}/tables`, {
      params: { ...params },
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent': '*',
        'x-api-key': process.env.NEXT_PUBLIC_REACT_APP_API_KEY || '',
      },
    });
    data = resp.data;
  } catch (e) {
    console.error(e);
  }

  return {
    props: {
      data,
    },
  };
}

function CollectionsPage({ data }) {
  return <Collections data={data} />;
}

export default CollectionsPage;
