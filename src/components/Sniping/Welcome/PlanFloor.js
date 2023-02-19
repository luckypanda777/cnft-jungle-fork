import { Box, CircularProgress } from '@mui/material';
import { getAssets } from 'apiProvider';
import { useAppContext } from 'context/AppContext';
import useWindowSize from 'hooks/useWindowSize';
import React, { useEffect, useState } from 'react';

const PlanFloor = ({ plan }) => {
  const { width } = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [floor, setFloor] = useState(plan.floor);

  useEffect(() => {
    getPlanFloor();
  }, [plan]);

  const getPlanFloor = async () => {
    if (!plan.policyId) return null;

    setLoading(true);

    try {
      const { assets } = await getAssets(plan.policyId, {
        onSale: true,
        sort: 'price',
        sortDirection: 'asc',
      });

      setFloor(assets[0].listing_price);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        columnGap: 1,
        mt: 1,
        mx: width < 900 && 'auto',
      }}
    >
      <span
        style={{
          fontSize: 50,
          color: plan.color,
          fontFamily: 'newgilroybold',
        }}
      >
        ₳
      </span>
      {loading ? (
        <CircularProgress sx={{ fontSize: 20 }} />
      ) : (
        <span
          style={{
            fontSize: 50,
            fontFamily: 'newgilroyregular',
          }}
        >
          {floor}
        </span>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            color: plan.color,
            fontFamily: 'newgilroybold',
          }}
        >
          Current
        </span>
        <span style={{ fontSize: 18, textTransform: 'uppercase' }}>
          Floor Price
        </span>
      </Box>
    </Box>
  );
};

export default PlanFloor;
