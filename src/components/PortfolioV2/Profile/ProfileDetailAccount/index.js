import { useState, useEffect } from 'react';
import { Stack } from '@mui/material';
import Skeleton from './Skeleton';
import Item from './Item';

const ProfileDetailAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <Stack gap="10px">
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Stack>
    );
  }
  return (
    <Stack gap="10px">
      <Item />
      <Item />
      <Item />
    </Stack>
  );
};

export default ProfileDetailAccount;
