import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { capitalize } from 'lodash';
import Docs from './Docs';
import Settings from './Settings';
import Webhooks from './Webhooks';
import useWindowSize from 'hooks/useWindowSize';
import { getLocationSearch } from 'utils/getSearch';

const ManageApiSubscription = () => {
  const router = useRouter();
  const [tab, setTab] = useState('Docs');
  const { width } = useWindowSize();

  const tryAgain = async () => {
    router.push('/manage-api-subscription/');
    setMessage('');
    setSuccess(false);
  };

  const handleTab = (newTab) => {
    setTab(newTab);

    router.push(
      {
        pathname: '/data/dashboard',
        query: { tab: newTab.toLowerCase() },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    const params = getLocationSearch();
    if ('tab' in params) {
      setTab(capitalize(params.tab));
    }
  }, [router.query]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        m: 2,
        flexDirection: width < 900 ? 'column' : 'row',
      }}
    >
      <WhiteCard
        sx={{
          display: 'flex',
          flexDirection: width < 900 ? 'row' : 'column',
          gap: 1,
          width: width < 900 ? 'auto' : 100,
          height: 'fit-content',
          m: 0,
        }}
      >
        {['Docs', 'Webhooks', 'Settings'].map((label, index) => (
          <Box sx={{ display: 'flex' }}>
            <Box key={label}>
              <span
                style={{
                  color:
                    tab === label ? 'var(--logoColor)' : 'var(--fontColor)',
                  textDecoration: tab === label && 'underline',
                  textDecorationColor:
                    tab === label ? 'var(--logoColor)' : 'var(--fontColor)',
                  cursor: 'pointer',
                }}
                onClick={() => handleTab(label)}
              >
                {capitalize(label)}
              </span>
            </Box>
          </Box>
        ))}
      </WhiteCard>
      <WhiteCard
        sx={{
          m: 0,
          height: 'fit-content',
          width: width < 900 ? 'auto' : '100%',
        }}
      >
        {tab === 'Docs' ? (
          <Docs />
        ) : tab === 'Webhooks' ? (
          <Webhooks />
        ) : (
          <Settings />
        )}
      </WhiteCard>
    </Box>
  );
};

export default ManageApiSubscription;
