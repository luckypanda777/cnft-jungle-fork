import { useEffect, useState } from 'react';
import { Box, capitalize, Divider } from '@mui/material';
import { TabPanel } from 'components/common/TabPanel';
import StartHunt from 'components/Sniping/Platform/NFTHunt/StartHunt';
import HuntHistory from 'components/Sniping/Platform/HuntHistory/HuntHistory';
import SavedHunts from 'components/Sniping/Platform/SavedHunts/SavedHunts';
import HuntSettings from 'components/Sniping/Platform/HuntSettings/HuntSettings';
import { AccessRequired } from 'components/Sniping/Platform/common';
import { useAuth } from 'hooks/useAuth';
import { useMountEffect } from 'hooks/useMountEffect';
import LiveHunting from 'components/Sniping/Platform/LiveHunting';
import { useRouter } from 'next/router';
import { getLocationSearch } from 'utils/getSearch';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import useWindowSize from 'hooks/useWindowSize';
import orca from 'assets/jungleorca.png';
import { useAppContext } from 'context/AppContext';

const ManageExtension = () => {
  const {
    state: { walletInfo },
  } = useAppContext();
  const { width } = useWindowSize();
  const router = useRouter();
  const { checkUser } = useAuth();
  const [tab, setTab] = useState('new');

  useEffect(() => {
    if (walletInfo.address) {
      checkUser();
    }
  }, [walletInfo.address]);

  const handleTab = (newValue) => {
    setTab(newValue || 'new');

    router.push({ query: { tab: newValue } }, undefined, { shallow: true });
  };

  useEffect(() => {
    const params = getLocationSearch();
    if ('tab' in params) {
      setTab(params.tab || 'new');
    } else {
      setTab('new');
    }
  }, [router.query]);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        m: 2,
        flexDirection: width < 900 ? 'column' : 'row',
        maxWidth: 1600,
        mx: 'auto',
      }}
    >
      <AccessRequired>
        <WhiteCard
          sx={{
            m: 0,
            p: 0,
            height: 'fit-content',
            minHeight: '80vh',
            width: width < 900 ? 'auto' : '100%',
          }}
        >
          <Box sx={{ p: 2, px: 3 }}>
            <Box
              sx={{
                display: 'flex',
                px: 5,
                my: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', columnGap: 5 }}>
                {[
                  { name: 'Start Hunt', label: 'new' },
                  { name: 'My Hunts', label: 'hunts' },
                  { name: 'Live Feed', label: 'live' },
                  { name: 'History', label: 'history' },
                  { name: 'Settings', label: 'settings' },
                ].map(({ name, label }, index) => (
                  <Box
                    key={label}
                    sx={{
                      color: tab === label ? 'var(--fontColor)' : '#BDBEC6',
                      borderBottom:
                        tab === label && '2px solid var(--logoColor)',
                      fontFamily: 'newgilroysemibold',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'var(--logoColor)',
                      },
                    }}
                    onClick={() => handleTab(label)}
                  >
                    {name}
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  fontSize: 20,
                  fontFamily: 'newgilroysemibold',
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: 1,
                }}
              >
                <img src={orca.src} height={40} />
                Predator Sniping Platform
              </Box>
            </Box>
          </Box>
          <Divider sx={{ width: '100%' }} />
          <Box sx={{ py: 1, px: 3 }}>
            <TabPanel value={tab} index={'new'}>
              <StartHunt />
            </TabPanel>
            <TabPanel value={tab} index={'hunts'}>
              <SavedHunts />
            </TabPanel>
            <TabPanel value={tab} index={'live'}>
              <LiveHunting />
            </TabPanel>
            <TabPanel value={tab} index={'history'}>
              <HuntHistory />
            </TabPanel>
            <TabPanel value={tab} index={'settings'}>
              <HuntSettings />
            </TabPanel>
          </Box>
        </WhiteCard>
      </AccessRequired>
    </Box>
  );
};

export default ManageExtension;
