import Portfolio from 'components/Portfolio';

export async function getServerSideProps(ctx) {
  const { address } = ctx.params;

  let data = null;

  // try {
  //   const resp = await axios.get(`${API_URL}/collections/${collection}`, {
  //     params,
  //     headers,
  //   });

  //   data = resp.data;
  // } catch (e) {
  //   console.error(e);
  // }

  return {
    props: { address },
  };
}

function PortfolioPage({ address }) {
  console.log('address', address);
  return <Portfolio queryAddress={address} />;
}

export default PortfolioPage;
