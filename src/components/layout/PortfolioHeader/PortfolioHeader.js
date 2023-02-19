import { useEffect, useState } from 'react';
import styles from './Header.module.scss';
import logo from 'assets/jungleorca.png';
import mobileLogo from 'assets/jungleorca.png';
import logoLight from 'assets/jungleorcalight.png';
import { useAppContext } from 'context/AppContext';
import Link from 'next/link';
import ThemeButton from 'components/buttons/ThemeButton';
import { CircularProgress, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { getCollections } from 'apiProvider';
import { nFormatter } from 'utils/formatCurrency';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import WhaleButton from 'components/buttons/WhaleButton';
import useWindowSize from 'hooks/useWindowSize';
import useDetectDevice from 'hooks/useDetectDevice';
import dynamic from 'next/dynamic';
import LeaderboardButton from 'components/buttons/LeaderboardButton';
import { useTheme } from 'next-themes';
import CustomTooltip from 'components/common/CustomTooltip';

const WalletButton = dynamic(() => import('components/buttons/WalletButton'), {
  ssr: false,
});

const Search = dynamic(() => import('../Search'), {
  ssr: false,
  loading: () => <Box sx={{ minWidth: '120px' }} />,
});

const StatBox = ({
  loading,
  icon,
  total,
  change,
  formatChange,
  title,
  soon,
  tooltip,
}) => {
  const negative = change < 0;
  const changeClass = negative ? styles.negative : styles.change;
  const changeDisplay = formatChange ? nFormatter(change) : change;
  const changeSign = change > 0 ? '+' : '-';

  return (
    <CustomTooltip title={tooltip}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
        <Box className={styles.title}>
          <span>{title}</span>
        </Box>
        {loading ? (
          <Box className={styles.loader}>
            <CircularProgress
              size={15}
              sx={{ color: 'var(--logoColor)', ml: 1 }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {soon ? (
              <Box className={styles.disabled}>Soon</Box>
            ) : (
              <>
                <Box className={styles.total}>{nFormatter(total, 1)}</Box>
                <Box className={changeClass}>
                  ({changeSign}
                  {changeDisplay})
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </CustomTooltip>
  );
};

const Header = () => {
  const [loading, setLoading] = useState(true);
  const { state, setProjects, setWallet, setTotal, setStats } = useAppContext();
  const size = useWindowSize();
  const { isMobile } = useDetectDevice();
  const { theme } = useTheme();

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
        setLoading(false);
      });
    }
  }, []);

  return (
    <>
      <Box className={styles.header}>
        <Box className={styles.primaryHeader}>
          <Box className={styles.brand}>
            <Link href="/whales">
              <a>
                <img
                  src={
                    theme === 'dark'
                      ? logoLight.src
                      : size.width < 1400
                      ? mobileLogo.src
                      : logo.src
                  }
                  alt="logo"
                  height={50}
                  width={75}
                />
              </a>
            </Link>
          </Box>
          <Box className={styles.brandMobile}>
            <Link href="/whales">
              <a>
                <img
                  src={theme === 'dark' ? logoLight.src : mobileLogo.src}
                  alt="brand logo"
                  width={60}
                  height={40}
                />
              </a>
            </Link>
          </Box>
          <Box className={styles.searchBar}>
            <Search placeholder="Search addresses, collections or assets" />
            <WhaleButton />
            <LeaderboardButton />
          </Box>
          <Box className={styles.userActions}>
            <WarningButton />
            <ThemeButton />
            <WalletButton
              portfolio
              wallet={state.wallet}
              setWallet={setWallet}
            />
          </Box>
        </Box>
      </Box>
      {isMobile && (
        <Box className={styles.mobilePagesHeader}>
          <Box className={styles.pages}>
            <WhaleButton hideOnMobile={false} />
            <LeaderboardButton hideOnMobile={false} />
          </Box>
          <Box className={styles.actions}>
            <ThemeButton />
          </Box>
        </Box>
      )}
    </>
  );
};

export default Header;
