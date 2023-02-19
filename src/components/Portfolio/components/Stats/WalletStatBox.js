import { Box, Skeleton } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { getChangeValue } from 'utils/change';
import { WalletStatBoxSkeleton } from '../LoadingSkeletons';

const WalletStatBox = ({
  name = 'Est. Metric',
  value = 1000000,
  postfix = '',
  periods = [
    {
      period: '7d',
      value: 10,
    },
    {
      period: '30d',
      value: 30,
    },
  ],
  display = 'percentage',
  loading,
}) => {
  if (loading) {
    return <WalletStatBoxSkeleton />;
  }

  const isPercentage = display === 'percentage';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        height: 'fit-content',
        position: 'relative',
      }}
    >
      <span style={{ fontSize: isPercentage ? 18 : 16 }}>{name}</span>
      <span style={{ fontSize: isPercentage ? 20 : 18 }}>
        {value.toLocaleString()} {postfix}
      </span>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 0.5,
          fontFamily: 'gilroylight',
        }}
      >
        {periods.map(({ period, value, style }, i) => {
          const { changeColor, changeText } = getChangeValue(value, false, 1);

          return (
            <span style={{ fontSize: 14, marginTop: 5 }} key={period}>
              <span
                style={{
                  borderRadius: 6,
                  backgroundColor: 'var(--primaryColor)',
                  color: 'white',
                  padding: '5px 10px',
                  fontSize: 10,
                  marginRight: 5,
                  ...style,
                }}
              >
                {period}
              </span>
              <span
                style={{
                  color: isPercentage ? changeColor : 'var(--fontColor)',
                }}
              >
                {isPercentage ? changeText : `${value} ${postfix}`}
              </span>
            </span>
          );
        })}
      </Box>
    </Box>
  );
};

export default WalletStatBox;
