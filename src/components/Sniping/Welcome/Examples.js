import { useRef, useState } from 'react';
import { Box, capitalize, Divider, Link } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import { snipeExamples } from './data/snipe-examples';
import useWindowSize from 'hooks/useWindowSize';
import pass from 'assets/hunterpreview.png';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import fullstar from 'assets/icons/full.png';
import Hunt from 'components/Sniping/Platform/SavedHunts/RunningHunts/components/Hunt';
import RulesPopover from 'components/Sniping/Platform/NFTHunt/RulesPopover';
import MoreIcon from 'assets/icons/plus.svg';

const Examples = () => {
  const [tab, setTab] = useState('trait-hunt');
  const codeExample = snipeExamples.find((code) => code.label === tab);
  const { width } = useWindowSize();
  const anchorEl = useRef(null);
  const [openedPopover, setOpenedPopover] = useState(false);

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  return (
    <>
      <WhiteCard
        sx={{
          width: '100%',
          height: 'fit-content',
          m: 0,
          maxWidth: width > 900 ? 1000 : 400,
          mx: 'auto',
          alignSelf: 'center',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          p: width > 900 ? 2 : 0,
          borderRadius: width > 900 ? '10px' : 0,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            rowGap: 1,
            py: 1,
            mx: 'auto',
            columnGap: width > 900 ? 8 : 2,
            alignItems: 'center',
            flexDirection: width < 900 ? 'column' : 'row',
          }}
        >
          <img
            src={pass.src}
            alt="pass"
            style={{
              width: width > 900 ? 350 : 250,
              height: width > 900 ? 'auto' : 400,
              borderRadius: 14,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              pt: 3,
              alignItems: width < 900 ? 'center' : 'flex-start',
            }}
          >
            <span
              style={{
                fontSize: 18,
                color: 'var(--goldenCard)',
                display: 'flex',
                columnGap: 5,
                alignItems: 'center',
              }}
            >
              <LocalFireDepartmentIcon fontSize="small" />
              <span style={{ paddingTop: 2 }}>Recent Mint</span>
            </span>
            <span
              style={{
                fontSize: width > 900 ? 32 : 24,
                marginTop: 10,
              }}
            >
              Hunter Lifetime Pass
            </span>
            <Box
              sx={{
                my: width > 900 ? 2 : 1,
                display: 'flex',
                flexDirection: 'column',
                rowGap: 0.75,
              }}
            >
              {[
                'Price Hunts',
                'Rarity Hunts',
                'Trait Hunts',
                'Name Hunts',
                'Regex Hunts',
              ].map((w) => {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 2,
                      fontSize: width > 900 ? 20 : 16,
                      justifyContent: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <VerifiedBadge
                      verified={true}
                      width={27}
                      sx={{ marginLeft: -8 }}
                    />
                    <span style={{ paddingTop: 2 }}>{w}</span>
                  </Box>
                );
              })}
            </Box>
            <span
              style={{
                fontSize: width > 900 ? 16 : 14,
                maxWidth: 400,
                fontFamily: 'Montserrat',
                width: width < 900 ? 300 : 'auto',
                textAlign: width < 900 ? 'center' : 'left',
              }}
            >
              Hunter Pass gives you lifetime subscription free access to our
              sniping services and tools as well as customer support and closed
              sniper groups.
            </span>
            <Box
              sx={{
                my: width > 900 ? 3 : 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: width < 900 ? 'center' : 'flex-start',
              }}
            >
              {['1000 Supply', 'SOLD OUT'].map((w) => {
                return (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 2,
                      fontSize: width > 900 ? 20 : 16,
                      justifyContent: 'flex-start',
                      width: '100%',
                    }}
                  >
                    <img
                      src={fullstar.src}
                      style={{ width: 35, height: 35, marginLeft: -4 }}
                    />
                    <span style={{ paddingTop: 2 }}>{w}</span>
                  </Box>
                );
              })}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: 1,
                  fontSize: 18,
                  justifyContent: 'flex-start',
                  width: 'fit-content',
                  color: 'var(--fontColor)',
                  borderBottom: '2px solid var(--logoColor)',
                  mt: 2,
                  fontFamily: 'newgilroysemibold',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'var(--logoColor)',
                  },
                }}
                onClick={() =>
                  window.open('https://jpg.store/collection/hunterpass')
                }
              >
                <span>Buy Now</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </WhiteCard>
      {width > 900 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            rowGap: 4,
          }}
        >
          <span style={{ fontSize: 32 }}>Hunt Previews</span>
          <WhiteCard
            sx={{
              width: '100%',
              height: 'fit-content',
              m: 0,
              maxWidth: 1200,
              mx: 'auto',
              alignSelf: 'center',
              maxHeight: 325,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                rowGap: 1,
                py: 1,
                maxWidth: 1200,
                mx: 'auto',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  columnGap: 3,
                  fontSize: width < 900 ? 12 : 14,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mx: 4,
                }}
              >
                <Box sx={{ display: 'flex', columnGap: 3 }}>
                  {snipeExamples.map((code, index) => (
                    <Box key={code.label}>
                      <Box
                        sx={{
                          color:
                            tab === code.label ? 'var(--fontColor)' : '#BDBEC6',
                          paddingBottom: '2px',
                          borderBottom:
                            tab === code.label && '2px solid var(--logoColor)',
                          fontFamily: 'newgilroysemibold',
                          cursor: 'pointer',
                          cursor: 'pointer',
                          fontSize: 16,
                          fontFamily: 'newgilroysemibold',
                          '&:hover': {
                            color: 'var(--logoColor)',
                          },
                        }}
                        onClick={() => setTab(code.label)}
                      >
                        {capitalize(code.name)}
                      </Box>
                    </Box>
                  ))}
                </Box>
                {width > 900 && (
                  <Box sx={{ fontSize: 16, display: 'flex' }}>
                    <Box
                      sx={{
                        color: 'var(--logoColor)',
                        cursor: 'pointer',
                        mx: 0.5,
                      }}
                      ref={anchorEl}
                      onMouseEnter={handlePopoverOpen}
                      onMouseLeave={handlePopoverClose}
                    >
                      <MoreIcon width={35} height={35} />
                    </Box>
                    <RulesPopover
                      anchor={anchorEl}
                      open={openedPopover}
                      handleClose={handlePopoverClose}
                      handleOpen={handlePopoverOpen}
                      handleClick={() => {}}
                      selectedRules={codeExample.hunt.rules}
                      showAllRules
                    />
                  </Box>
                )}
              </Box>
              <Divider sx={{ width: '100%', mx: 'auto', my: 1 }} />
              <Box sx={{ fontSize: width < 900 ? 14 : 18, mx: 4 }}>
                {codeExample.description}
              </Box>
              <Box sx={{ mx: 4 }}>
                <Hunt {...codeExample.hunt} />
              </Box>
              {/* <img
              src={codeExample.image.src}
              alt={codeExample.name}
              style={{
                borderRadius: 6,
                width: '100%',
                alignSelf: 'center',
                maxWidth: 800,
              }}
            /> */}
            </Box>
          </WhiteCard>
        </Box>
      )}
    </>
  );
};

export default Examples;
