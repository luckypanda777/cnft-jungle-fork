import { Divider, ListItem, ListItemText, Skeleton } from '@mui/material';
import { marketplaceList } from 'components/Assets/graphs/data/marketplace-list';
import React from 'react';

const WhaleListItem = ({ address, stake, value, loading, isLast }) => {
  if (loading) {
    return (
      <>
        <ListItem sx={{ height: 80 }}>
          <ListItemText>
            <Skeleton
              animation="wave"
              height={10}
              style={{ marginBottom: 6 }}
            />
            <Skeleton animation="wave" height={10} width="80%" />
          </ListItemText>
        </ListItem>
        {!isLast && <Divider sx={{ width: '100%' }} />}
      </>
    );
  }

  return (
    <>
      <ListItem
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          textAlign: 'center',
          borderRadius: 1,
          px: 3,
        }}
      >
        <ListItemText sx={{ fontWeight: 'bold', textAlign: 'left' }}>
          {marketplaceList[address] || stake}
        </ListItemText>
        <ListItemText sx={{ fontWeight: 'bold', textAlign: 'right' }}>
          {value} NFTs
        </ListItemText>
      </ListItem>
      {!isLast && <Divider sx={{ width: '100%', mt: 0.2 }} />}
    </>
  );
};

export default WhaleListItem;
