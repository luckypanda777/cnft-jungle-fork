import { CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import { Box } from '@mui/system';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getSingleAssetSales } from 'apiProvider';

const AssetSalesHistory = ({ asset }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (asset) {
      getAssetSales();
    }
  }, [asset]);

  const getAssetSales = async () => {
    setLoading(true);
    const salesData = await getSingleAssetSales(asset.asset_id)
      .then((res) => res.data?.sales || [])
      .catch((err) => {
        console.log(err);
        setLoading(false);
        return [];
      });

    setSales(salesData);
    return setLoading(false);
  };

  if (loading) {
    return (
      <Box
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={20}
          thickness={5}
          sx={{ color: 'var(--primaryColor)', ml: 1 }}
        />
      </Box>
    );
  }

  if (sales.length === 0) {
    return (
      <Box style={{ textAlign: 'center' }}>
        <span>No sales history.</span>
      </Box>
    );
  }

  const Sale = ({ marketplace, price, sold_at }) => {
    return (
      <ListItem>
        <ListItemText></ListItemText>
      </ListItem>
    );
  };

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <List>
        {sales.map((sale, index) => (
          <Sale {...sale} />
        ))}
      </List>
    </Box>
  );
};

export default AssetSalesHistory;
