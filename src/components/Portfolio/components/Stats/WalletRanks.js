import { Box, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { WatchRanksSkeleton } from '../LoadingSkeletons';

const WalletRanks = ({
  ranks = [
    { name: 'Est. Holdings', rank: parseInt(Math.random() * 1000) },
    { name: 'Floor Holdings', rank: parseInt(Math.random() * 1000) },
    { name: 'Total NFTs', rank: parseInt(Math.random() * 1000) },
  ],
  loading,
}) => {
  if (loading) {
    return <WatchRanksSkeleton />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        height: 'fit-content',
      }}
    >
      <span style={{ fontSize: 16 }}>Wallet Rank</span>
      {ranks.map(({ name, rank }, i) => {
        return (
          <span
            style={{
              fontSize: 16,
              marginTop: 5,
              display: 'flex',
              justifyContent: 'space-between',
              columnGap: 10,
              alignItems: 'center',
            }}
          >
            <span
              style={{
                backgroundColor:
                  rank < 10
                    ? 'goldenrod'
                    : rank < 50
                    ? 'var(--undervaluedColor)'
                    : rank < 250
                    ? 'var(--logoColor)'
                    : 'var(--rankGrey)',
                color: 'white',
                padding: '2px 10px',
                borderRadius: 6,
              }}
            >
              #{rank}
            </span>
            {name}
          </span>
        );
      })}
    </Box>
  );
};

export default WalletRanks;
