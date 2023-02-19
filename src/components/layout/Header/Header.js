import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from './Header.module.scss';
import JungleLogo from 'assets/icons/jungle.svg';
import { useAppContext } from 'context/AppContext';
import Link from 'next/link';
import { getCollections, getTotalVolume } from 'apiProvider';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import useWindowSize from 'hooks/useWindowSize';
import useDetectDevice from 'hooks/useDetectDevice';
import dynamic from 'next/dynamic';
import Cart from './Cart';
import DevelopersHeader from '../DevelopersHeader';
import MenuHeaderItem from './MenuHeaderItem';
import menuItem from '../MainSidebar/Menu/items';
import Sidebar from '../MainSidebar/SidebarV2';
import { nFormatter } from 'utils/formatCurrency';

const Change = ({ yesterday, today, isPercentage = true }) => {
  const change = today - yesterday;
  const percentage = ((today - yesterday) / yesterday) * 100;
  const symbol = change > 0 ? '+' : change === 0 ? '' : '-';
  const formattedChange = nFormatter(isPercentage ? percentage : change || 0);

  return (
    <span
      className={
        change > 0
          ? styles.compareHigher
          : change === 0
          ? styles.compareEqual
          : styles.compareLower
      }
      style={{ fontSize: 10 }}
    >
      {`(${symbol}${formattedChange}${isPercentage ? '%' : ''})`}
    </span>
  );
};

const WalletButton = dynamic(
  () => import('components/buttons/WalletButton/WalletButtonV2'),
  {
    ssr: false,
  }
);

const Search = dynamic(() => import('../Search'), {
  ssr: false,
  loading: () => <Box sx={{ minWidth: '120px' }} />,
});

const Header = ({ handleMenu }) => {
  const { state, setProjects, setWallet, setTotal, setStats } = useAppContext();
  const size = useWindowSize();
  const { isMobile } = useDetectDevice();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [marketInfo, setMarketInfo] = useState({
    sales: 0,
    adaVolume: 0,
    usdVolume: 0,
  });

  useEffect(() => {
    if (!state.projects.length) {
      getCollections({
        sort: 'popularity',
        sortDirection: 'desc',
        perPage: 1,
      }).then((response) => {
        setProjects(response.collections);
        setTotal(response.total);
        setStats({
          totalAssets: response.total_assets,
          totalCollections: response.total_collections,
          totalListings: response.total_listings,
          totalTrades: response.total_trades,
          lastDayMinted: response.last_day_minted,
          totalAssetsChange: response.total_assets_change || 0,
          totalCollectionsChange: response.total_collections_change || 0,
          totalListingsChange: response.total_listings_change || 0,
          totalTradesChange: response.total_trades_change || 0,
          lastDayMintedChange: response.last_day_minted_change || 0,
        });
      });
    }
  }, []);

  useEffect(() => {
    fetchMarketOverviewData();
  }, []);

  const fetchMarketOverviewData = async () => {
    try {
      const data = await getTotalVolume();
      const usdRatio = await axios
        .get(`https://cnft-predator.herokuapp.com/usd-history?interval=24h`)
        .then((res) => res.data.data);

      const usdPrice = usdRatio[usdRatio.length - 1];

      setMarketInfo({
        sales: data.sales,
        salesYesterday: data.sales_yesterday,
        adaVolume: data.total_ada_traded_for_nfts,
        adaVolumeYesterday: data.total_ada_traded_for_nfts_yesterday,
        usdVolume: data.total_ada_traded_for_nfts * usdPrice,
        usdPrice,
      });
    } catch (err) {
      console.error(err);
      setMarketInfo({
        sales: '-',
        adaVolume: '-',
        usdVolume: '-',
        usdPrice: '-',
      });
    }
    setIsLoading(false);
  };

  const subdomain = /:\/\/([^\/]+)/.exec(window.location.href)[1];

  if (subdomain.includes('developers')) {
    return <DevelopersHeader />;
  }

  return (
    <AppBar
      enableColorOnDark
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        bgcolor: 'var(--bgColor)',
        height: 'var(--headerHeight)',
      }}
    >
      <div className={styles.headerNews}>
        {state.stats?.totalCollections && (
          <div
            className={styles.headerNewsWrap}
            onClick={() => router.push('/statistics')}
          >
            <div className={styles.headerNewsName}>Collections:</div>
            <div className={styles.headerValue}>
              {`${(state.stats?.totalCollections || '-')?.toLocaleString()}`}
            </div>
            <Change
              yesterday={state.stats?.totalCollections}
              today={
                state.stats?.totalCollections +
                state.stats?.totalCollectionsChange
              }
              isPercentage={false}
            />
          </div>
        )}
        {!isLoading && (
          <>
            <div
              className={styles.headerNewsWrap}
              onClick={() => router.push('/statistics')}
            >
              <div className={styles.headerNewsName}>Ada/24h:</div>
              <div className={styles.headerValue}>
                {`₳${marketInfo?.adaVolume.toLocaleString()}`}
              </div>
              <Change
                yesterday={marketInfo.adaVolumeYesterday}
                today={marketInfo.adaVolume}
              />
            </div>
            <div
              className={styles.headerNewsWrap}
              onClick={() => router.push('/statistics')}
            >
              <div className={styles.headerNewsName}>Usd/24h:</div>
              <div className={styles.headerValue}>
                {`$${parseInt(marketInfo?.usdVolume).toLocaleString()}`}
              </div>
              <Change
                yesterday={marketInfo.adaVolumeYesterday}
                today={marketInfo.adaVolume}
              />
            </div>
            <div
              className={styles.headerNewsWrap}
              onClick={() => router.push('/statistics')}
            >
              <div className={styles.headerNewsName}>Sales/24h:</div>
              <div className={styles.headerValue}>
                {marketInfo?.sales.toLocaleString()}
              </div>
              <Change
                yesterday={marketInfo.salesYesterday}
                today={marketInfo.sales}
              />
            </div>
            <div
              className={styles.headerNewsWrap}
              onClick={() => router.push('/statistics')}
            >
              <div className={styles.headerNewsName}>Ada/Usd:</div>
              <div className={styles.headerValue}>
                {`$${
                  marketInfo?.usdPrice === '-'
                    ? '-'
                    : marketInfo?.usdPrice.toFixed(2)
                }`}
              </div>
            </div>
          </>
        )}
      </div>
      <Toolbar className={styles.headerWrap}>
        <Box className={styles.header}>
          <Box className={styles.primaryHeader}>
            <Box className={styles.headerLeft}>
              <Box className={styles.brand}>
                <Link href="/">
                  <a>
                    <JungleLogo width={100} height={35} />
                  </a>
                </Link>
              </Box>
              <Box className={styles.searchBar}>
                <Search />
              </Box>
            </Box>
            <Box className={styles.headerRight}>
              <Box
                className={styles.menuWrap}
                sx={{ display: 'flex', columnGap: '30px', mr: '30px' }}
              >
                {menuItem.map((category, i) => {
                  const children = category.items.map((child) => {
                    return {
                      name: child.title,
                      url: child.route,
                    };
                  });
                  return (
                    <MenuHeaderItem
                      key={i}
                      name={category.name}
                      isMenu={true}
                      children={children}
                    />
                  );
                })}
              </Box>
              <Box className={styles.userActions}>
                <WalletButton wallet={state.wallet} setWallet={setWallet} />
                <Cart />
                <Sidebar />
                {/* <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleMenu}
                  sx={{
                    marginRight: 0,
                    width: 42,
                    height: 44,
                    borderLeft: '1px solid var(--headerNewsBgColor)',
                    borderRadius: 0,
                  }}
                >
                  <IConGroup />
                </IconButton> */}
              </Box>
            </Box>
          </Box>
        </Box>
        {/*{isMobile && (
            <Box className={styles.mobilePagesHeader}>
              <Box className={styles.pages}>
                <StatisticsButton hideOnMobile={false} />
                <CalendarButton hideOnMobile={false} />
                <MintingNowButton hideOnMobile={false} />
                <SnipingButton hideOnMobile={false} />
              </Box>
              <Box className={styles.actions}>
                <ThemeButton />
              </Box>
            </Box>
          )}*/}
      </Toolbar>
      {process.env.NEXT_PUBLIC_REACT_APP_MAINTENANCE_TEXT && (
        <Box
          sx={{
            p: 1,
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--primaryColor)',
            fontFamily: 'newgilroysemibold',
            zIndex: 10000,
          }}
        >
          {process.env.NEXT_PUBLIC_REACT_APP_MAINTENANCE_TEXT}
        </Box>
      )}
    </AppBar>
  );
};

export default Header;
