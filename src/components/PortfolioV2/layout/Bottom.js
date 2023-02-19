import { Grid } from '@mui/material';
import ActivityBottom from '../Activity/Bottom';
import { PORTFOLIO_TABS } from '../constants';
import ListingsBottom from '../Listings/Bottom';
import MintsBottom from '../Mints/Bottom';
import useTabsValue from '../hooks/useTabsValue';
import PortfolioBottom from '../Portfolio/Bottom';
import ProfileBottom from '../Profile/Bottom';
import WatchlistBottom from '../Watchlist/Bottom';

const Bottom = () => {
  const [activeTab] = useTabsValue();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div hidden={activeTab !== PORTFOLIO_TABS.PROFILE}>
          <ProfileBottom />
        </div>
        <div hidden={activeTab !== PORTFOLIO_TABS.PORTFOLIO}>
          <PortfolioBottom />
        </div>
        <div hidden={activeTab !== PORTFOLIO_TABS.LISTINGS}>
          <ListingsBottom />
        </div>
        <div hidden={activeTab !== PORTFOLIO_TABS.MINTS}>
          <MintsBottom />
        </div>
        <div hidden={activeTab !== PORTFOLIO_TABS.ACTIVITY}>
          <ActivityBottom />
        </div>
        <div hidden={activeTab !== PORTFOLIO_TABS.WATCHLIST}>
          <WatchlistBottom />
        </div>
      </Grid>
    </Grid>
  );
};

export default Bottom;
