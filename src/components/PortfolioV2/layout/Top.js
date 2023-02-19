import { Box } from '@mui/material';
import ActivityTop from '../Activity/Top';
import { PORTFOLIO_TABS } from '../constants';
import ListingsTop from '../Listings/Top';
import MintsTop from '../Mints/Top';
import useTabsValue from '../hooks/useTabsValue';
import PortfolioTop from '../Portfolio/Top';
import ProfileTop from '../Profile/Top';
import WatchlistTop from '../Watchlist/Top';

const Top = () => {
  const [activeTab] = useTabsValue();

  return (
    <Box>
      <div hidden={activeTab !== PORTFOLIO_TABS.PROFILE}>
        <ProfileTop />
      </div>
      <div hidden={activeTab !== PORTFOLIO_TABS.PORTFOLIO}>
        <PortfolioTop />
      </div>
      <div hidden={activeTab !== PORTFOLIO_TABS.LISTINGS}>
        <ListingsTop />
      </div>
      <div hidden={activeTab !== PORTFOLIO_TABS.MINTS}>
        <MintsTop />
      </div>
      <div hidden={activeTab !== PORTFOLIO_TABS.ACTIVITY}>
        <ActivityTop />
      </div>
      <div hidden={activeTab !== PORTFOLIO_TABS.WATCHLIST}>
        <WatchlistTop />
      </div>
    </Box>
  );
};

export default Top;
