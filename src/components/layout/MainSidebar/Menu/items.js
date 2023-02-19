import QueryStatsIcon from '@mui/icons-material/QueryStats';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BowIcon from 'assets/bow.svg';
import PhishingIcon from '@mui/icons-material/Phishing';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CrisisAlertIcon from '@mui/icons-material/CrisisAlert';
import upcomingicon from 'assets/icons/upcoming collections.png';
import managesubscription from 'assets/icons/manage-subscription.png';
import metadata from 'assets/icons/metadata.png';
import advertise from 'assets/icons/advertise.png';
import styles from '../styles.module.scss';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import RadarOutlinedIcon from '@mui/icons-material/RadarOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import AdvertiseIcon from 'assets/icons/gromofon.svg';

export const marketCategory = {
  name: 'Markets',
  items: [
    {
      title: 'Statistics',
      description: 'Statistics Overview',
      icon: (
        <QueryStatsIcon fontSize="medium" sx={{ color: 'var(--fontColor)' }} />
      ),
      // icon: (
      //   <img
      //     src={statsicon.src}
      //     width={25}
      //     height={25}
      //     className={styles.inversePng}
      //   />
      // ),
      route: '/statistics',
    },
    {
      title: 'NFT Indexes',
      description: 'NFT Indexes',
      icon: (
        <SignalCellularAltIcon
          fontSize="medium"
          sx={{ color: 'var(--fontColor)' }}
        />
      ),
      // icon: (
      //   <img
      //     src={Indexesicon.src}
      //     width={25}
      //     height={25}
      //     className={styles.inversePng}
      //   />
      // ),
      route: '/indexes',
    },
    // {
    //   title: 'Leaderboard',
    //   description: 'Leaderboard',
    //   icon: <EmojiEventsIcon fontSize="medium" />,
    //   route: '/leaderboards',
    // },
    // {
    //   title: 'Leaderboard',
    //   description: 'Leaderboard',
    //   icon: <PhishingIcon fontSize="medium" />,
    //   route: '/whales',
    // },
  ],
};

export const exploreCategory = {
  name: 'Explore',
  items: [
    {
      title: 'Upcoming Collections',
      description: 'Collection Calendar',
      // icon: <DateRangeIcon fontSize="medium" />,
      icon: (
        <img
          src={upcomingicon.src}
          width={25}
          height={25}
          className={styles.inversePng}
        />
      ),
      route: '/calendar',
    },
    {
      title: 'Minting Now',
      description: 'Minting now',
      icon: (
        <LocalFireDepartmentIcon
          sx={{ color: 'var(--fontColor)', fontSize: 25 }}
        />
      ),
      route: '/minting',
    },
  ],
};

export const userCategory = {
  name: 'Personal Jungle',
  items: [
    {
      title: 'Advertise on Jungle',
      description: 'Advertise on Jungle',
      icon: <AdvertiseIcon width={25} height={25} />,
      route: '/promotions',
      style: {
        fontFamily: 'newgilroybold',
        color: 'var(--fontColor)',
      },
    },
    {
      title: 'Jungle Mobile App',
      description: 'Watch realtime listing feed and current watchlist listings',
      icon: (
        <PhoneAndroidIcon sx={{ color: 'var(--primaryColor)', fontSize: 25 }} />
      ),
      route: 'https://cuda.io/nftjungle',
      style: { color: 'var(--fontColor)', fontFamily: 'newgilroybold' },
      new: true,
    },
    {
      title: 'My Watchlist',
      description: 'Watch realtime listing feed and current watchlist listings',
      icon: (
        <RadarOutlinedIcon
          sx={{ color: 'var(--primaryColor)', fontSize: 25 }}
        />
      ),
      route: '/watchlist',
      style: { color: 'var(--fontColor)', fontFamily: 'newgilroybold' },
      new: true,
    },
    {
      title: 'Request a Feature',
      description: 'Request a Feature',
      icon: <TaskAltIcon sx={{ color: 'var(--undervaluedColor)' }} />,
      route: 'https://roadmap.cnftjungle.io',
      style: {
        color: 'var(--fontColor)',
        fontFamily: 'newgilroybold',
      },
    },
    // {
    //   title: 'Portfolio',
    //   description: 'Check your holdings, their ranks and value',
    //   icon: (
    //     <AccountBalanceWalletOutlinedIcon
    //       sx={{ color: 'var(--fontColor)', fontSize: 25 }}
    //     />
    //   ),
    //   route: '/addresses/me',
    // },
  ],
};

export const snipingCategory = {
  name: 'NFT Sniping',
  items: [
    {
      title: 'Get Started',
      description: 'Sniping',
      icon: <BowIcon width={22} height={22} />,
      route: '/sniping',
    },
    {
      title: 'Sniping Dashboard',
      description: 'Sniping',
      icon: (
        <DashboardIcon fontSize="medium" sx={{ color: 'var(--fontColor)' }} />
      ),
      route: '/manage-extension',
      extensionOnly: true,
    },
  ],
};

export const additionalCategory = {
  name: 'Jungle Utilities',
  items: [
    {
      title: 'Check your Metadata',
      description: 'Check your metadata for CIP-25 standard',
      icon: (
        <img
          src={metadata.src}
          width={25}
          height={25}
          className={styles.inversePng}
        />
      ),
      route: 'https://metadata.cnftjungle.io',
    },
  ],
};

export default [
  snipingCategory,
  exploreCategory,
  marketCategory,
  userCategory,
  additionalCategory,
];
