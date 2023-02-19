import React, { useEffect, useMemo, useState } from 'react';
import { Box, useTheme } from '@mui/system';
import { Skeleton } from '@mui/material';
import MainCard from '../../MarketOverview/graphs/MainCard';
import { useAppContext } from 'context/AppContext';
import axios from 'axios';
import { colors } from 'components/MarketAnalysis/graphs/chart-data/graph-constants';
import { isMobile } from 'react-device-detect';
import { nFormatter } from 'utils/formatCurrency';
import { getPriceToRarity } from 'apiProvider';

const RarityFloors = ({}) => {
  const theme = useTheme();
  const { state } = useAppContext();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVolumeFloorHisotry();
  }, [state.collection]);

  const getVolumeFloorHisotry = async () => {
    if (!state.collection.id) return;

    try {
      const priceToRarity = await getPriceToRarity(state.collection.id).then(
        (res) => res.priceToRarity || []
      );

      setListings(priceToRarity);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const memoizedListings = useMemo(() => {
    const collectionRankPercent = state.collection.supply / 100;
    const listingsByRank = listings.sort(
      (a, b) => b.rarity_rank - a.rarity_rank
    );

    const getFloorRange = (percent) => {
      return listingsByRank
        .filter(
          (a) =>
            a.rarity_rank >= percent.min * collectionRankPercent &&
            a.rarity_rank <= percent.max * collectionRankPercent
        )
        .sort((a, b) => a.price - b.price)[0]?.price;
    };

    const floors = [
      { min: 0, max: 1, name: 'Top 1%' },
      { min: 1, max: 2, name: 'Top 2%' },
      { min: 2, max: 5, name: 'Top 5%' },
      { min: 5, max: 10, name: 'Top 10%' },
      { min: 10, max: 25, name: 'Top 25%' },
      { min: 25, max: 50, name: 'Top 50%' },
      { min: 50, max: 100, name: 'All' },
    ].map((percent) => {
      return { name: percent.name, value: getFloorRange(percent) };
    });

    return floors;
  }, [state.collection, listings]);

  return (
    <Box sx={{ borderRadius: '10px', backgroundColor: 'var(--bgColor)', p: 2 }}>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          '@media screen and (max-width: 1000px)': {
            flexDirection: 'column',
            rowGap: 2,
          },
        }}
      >
        <span
          style={{
            color: 'var(--fontColor)',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Floor Per Rarity
        </span>
      </Box>
      {loading ? (
        <>
          <Skeleton height={5} sx={{ transform: 'none', my: 4 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 4 }} />
          <Skeleton height={5} sx={{ transform: 'none', my: 4 }} />
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            p: isMobile ? 2 : 3,
            flexWrap: 'wrap',
            justifyContent: 'flex-around',
            gap: 1,
          }}
        >
          {memoizedListings.map((floor, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                border: '3px solid var(--primaryColor)',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                flex: 1,
                minWidth: isMobile ? '25%' : 'auto',
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  color: colors[index],
                  fontWeight: 'bold',
                  marginBottom: 4,
                }}
              >
                {floor.name}
              </span>
              <span style={{ fontSize: isMobile ? 16 : 20 }}>
                {nFormatter(floor.value, 2)} ADA
              </span>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RarityFloors;
