import React, { useState } from 'react';
import Wallets from '../components/Wallets';
import { Box, Divider } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import Profile from '../components/Profile';
import WatchlistStats from '../components/WatchlistStats';
import AddSingleValueModal from 'components/modals/AddSingleValueModal';
import { isMobile } from 'react-device-detect';
import {
  PortfolioStats,
  ActivityStats,
  MintStats,
  ListingsStats,
  WalletStats,
} from '../components';

export const VerticalDivider = () => {
  if (isMobile) {
    return <Divider />;
  }

  return (
    <Divider
      orientation="vertical"
      sx={{
        width: '1px',
        height: 300,
        my: 'auto',
        mx: 2,
      }}
    />
  );
};

const Performance = ({ tab, isMyPortfolio, address }) => {
  const [valueModalType, setValueModalType] = useState('');

  // const filters = useStore((state) => state.portfolio.activeTab.filters);
  // const setFilters = useStore((state) => state.portfolio.setFilters);

  // const handleChange = (value) => {
  //   setFilters({ marketplaces: value });
  // };
  // if (isMyPortfolio) {
  //   return (
  //     <>
  //       <WhiteCard sx={{ pt: 0 }}>
  //         {tab === 'profile' && (
  //           <Box sx={{ display: 'flex' }}>
  //             <Profile address={address} />
  //             <VerticalDivider />
  //             <WalletStats address={address} />
  //           </Box>
  //         )}
  //         {tab === 'portfolio' && (
  //           <Box sx={{ display: 'flex' }}>
  // <Box sx={{ flex: 4 }}>
  // <PerformanceChart address={address} />
  // </Box>;
  //             <VerticalDivider />
  //             <Wallets setValueModalType={setValueModalType} />
  //           </Box>
  //         )}
  //         {tab === 'listings' && (
  //           <Box sx={{ display: 'flex' }}>
  //             <ListingStats address={address} />
  //             <VerticalDivider />
  //             <Wallets setValueModalType={setValueModalType} />
  //           </Box>
  //         )}
  //         {tab === 'mints' && (
  //           <Box sx={{ display: 'flex' }}>
  //             <MintStats address={address} />
  //             <VerticalDivider />
  //             <Wallets setValueModalType={setValueModalType} />
  //           </Box>
  //         )}
  //         {tab === 'activity' && (
  //           <Box sx={{ display: 'flex' }}>
  //             <ActivityStats address={address} />
  //             <VerticalDivider />
  //             <Wallets setValueModalType={setValueModalType} />
  //           </Box>
  //         )}
  //         {tab === 'watchlist' && (
  //           <Box sx={{ display: 'flex' }}>
  //             {/* <Profile address={address} />
  //           <VerticalDivider /> */}
  //             <WatchlistStats
  //               setValueModalType={setValueModalType}
  //               isMyPortfolio
  //               address={address}
  //             />
  //           </Box>
  //         )}
  //       </WhiteCard>
  //       <AddSingleValueModal
  //         type={valueModalType}
  //         setValueModalType={setValueModalType}
  //       />
  //     </>
  //   );
  // }

  return (
    <>
      <WhiteCard
        sx={{
          pt: 0,
          height: 'fit-content',
        }}
      >
        {tab === 'profile' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            <Profile address={address} />
            <VerticalDivider />
            <WalletStats address={address} />
          </Box>
        )}
        {tab === 'portfolio' && (
          <Box
            sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}
          >
            {isMyPortfolio ? (
              <PortfolioStats address={address} />
            ) : (
              <Profile address={address} />
            )}
            <VerticalDivider />
            {isMyPortfolio ? (
              <Wallets setValueModalType={setValueModalType} />
            ) : (
              <PortfolioStats address={address} />
            )}
          </Box>
        )}
        {tab === 'listings' && (
          <Box sx={{ display: 'flex' }}>
            {isMyPortfolio ? (
              <ListingsStats address={address} />
            ) : (
              <Profile address={address} />
            )}
            <VerticalDivider />
            {isMyPortfolio ? (
              <Wallets setValueModalType={setValueModalType} />
            ) : (
              <ListingsStats address={address} />
            )}
          </Box>
        )}
        {tab === 'mints' && (
          <Box sx={{ display: 'flex' }}>
            {isMyPortfolio ? (
              <MintStats address={address} />
            ) : (
              <Profile address={address} />
            )}
            <VerticalDivider />
            {isMyPortfolio ? (
              <Wallets setValueModalType={setValueModalType} />
            ) : (
              <MintStats address={address} />
            )}
          </Box>
        )}
        {tab === 'activity' && (
          <Box sx={{ display: 'flex' }}>
            {isMyPortfolio ? (
              <ActivityStats address={address} />
            ) : (
              <Profile address={address} />
            )}
            <VerticalDivider />
            {isMyPortfolio ? (
              <Wallets setValueModalType={setValueModalType} />
            ) : (
              <ActivityStats address={address} />
            )}
          </Box>
        )}
        {tab === 'watchlist' && (
          <Box sx={{ display: 'flex' }}>
            {!isMyPortfolio && <Profile address={address} />}
            {!isMyPortfolio && <VerticalDivider />}
            <WatchlistStats
              setValueModalType={setValueModalType}
              isMyPortfolio={isMyPortfolio}
              address={address}
            />
          </Box>
        )}
      </WhiteCard>
      <AddSingleValueModal
        type={valueModalType}
        setValueModalType={setValueModalType}
      />
    </>
  );
};

export default Performance;
