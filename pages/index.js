import dynamic from 'next/dynamic';

const Collections = dynamic(() => import('components/Collections'), {
  ssr: false,
});

export async function getServerSideProps() {
  return {
    props: {},
  };
}

function HomePage(props) {
  return <Collections {...props} />;
}

export default HomePage;
