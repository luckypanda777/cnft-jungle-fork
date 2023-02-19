import Activity from '../tabs/Activity';
import Listings from '../tabs/Listings';
import Mints from '../tabs/Mints';
import Portfolio from '../tabs/Portfolio';
import Profile from '../tabs/Profile';
import Watchlist from '../tabs/Watchlist';

export const PORTFOLIO_TABS = [
  {
    name: 'Profile',
    label: 'profile',
    route: '/profile',
    number: 0,
    component: Profile,
    hideFilters: true,
  },
  {
    name: 'Portfolio',
    label: 'portfolio',
    route: '/portfolio',
    number: 1,
    component: Portfolio,
  },
  {
    name: 'Listings',
    label: 'listings',
    route: '/listings',
    number: 2,
    component: Listings,
  },
  {
    name: 'Mints',
    label: 'mints',
    route: '/mints',
    desktopOnly: true,
    number: 3,
    component: Mints,
  },
  {
    name: 'Activity',
    label: 'activity',
    route: '/activity',
    number: 4,
    component: Activity,
  },
  {
    name: 'Watchlist',
    label: 'watchlist',
    route: '/watchlist',
    number: 5,
    component: Watchlist,
  },
];
