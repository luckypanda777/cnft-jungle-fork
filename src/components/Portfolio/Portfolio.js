import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from 'context/AppContext';
import styles from './Portfolio.module.scss';
import ScrollToTopOnMount from 'components/common/ScrollToTop';
import { Box, Grid } from '@mui/material';
import Performance from './layout/Performance';
import { getLocationSearch } from 'utils/getSearch';
import Details from './layout/Details';
import Controls from './layout/Controls';
import { PORTFOLIO_TABS } from './layout/tabs';

const Portfolio = ({ isMyPortfolio, queryAddress }) => {
  const router = useRouter();
  const [tab, setTab] = useState(PORTFOLIO_TABS[0]);
  const [groupBy, setGroupBy] = useState('asset');
  const {
    state: { walletInfo },
  } = useAppContext();

  const address = useMemo(() => {
    return queryAddress || walletInfo.address;
  }, [queryAddress, walletInfo.address]);

  useEffect(() => {
    const params = getLocationSearch();
    if ('tab' in params) {
      const urlTab = PORTFOLIO_TABS.find((t) => t.label === params.tab);
      setTab(urlTab || PORTFOLIO_TABS[0]);
    } else {
      setTab(PORTFOLIO_TABS[0]);
    }
  }, [address, router.query]);

  const handleTab = (newValue) => {
    setTab(newValue);

    router.push(
      {
        pathname: isMyPortfolio
          ? '/portfolio-old'
          : `/portfolio-old/${address}`,
        query: { tab: newValue.label },
      },
      undefined,
      { shallow: true }
    );
  };

  const changeTab = (name) => {
    handleTab(PORTFOLIO_TABS.find((tab) => tab.label === name));
  };

  return (
    <>
      <ScrollToTopOnMount />
      <Box className={styles.body}>
        <Grid
          container
          sx={{
            width: '100%',
            maxWidth: 1600,
            mx: 'auto',
            mb: 3,
          }}
        >
          <Performance
            tab={tab.label}
            isMyPortfolio={isMyPortfolio}
            address={address}
          />
          <Controls tab={tab} handleTab={handleTab} />
          <Details
            tab={tab}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            changeTab={changeTab}
            address={address}
          />
        </Grid>
      </Box>
    </>
  );
};

export default Portfolio;
