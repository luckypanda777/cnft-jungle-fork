import { useRef, useState } from 'react';
import { Stack, Box } from '@mui/material';
import {
  PORTFOLIO_STATUS,
  PROFILE_BOTTOM_TYPE,
} from 'components/PortfolioV2/constants';
import Item from './Item';
import Skeleton from './Skeleton';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import styles from './ProfileDetailTradeMint.module.scss';

const fakeData = [
  {
    avatar:
      'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
    title: 'Jukeboys #1111',
    status: PORTFOLIO_STATUS.BUY,
    liked: false,
  },
  {
    avatar:
      'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
    title: 'Jukeboys #1112',
    status: PORTFOLIO_STATUS.SALE,
    liked: false,
  },
  {
    avatar:
      'https://image-optimizer.jpgstoreapis.com/QmPGJbXjsJgUDotcAiosu6Gspo84u3FkzAS3FaKmfctZJA?width=1200',
    title: 'Jukeboys #1113',
    status: PORTFOLIO_STATUS.MINT,
    liked: true,
  },
];

const ProfileDetailTrade = ({ type }) => {
  const [data, setData] = useState([]);
  const containerRef = useRef(null);

  const fetchData = () => {
    setTimeout(() => {
      //call api with urlApi
      let apiUrl = '';
      switch (type) {
        case PROFILE_BOTTOM_TYPE.MINT:
          apiUrl = 'mint';
          break;
        case PROFILE_BOTTOM_TYPE.TRADE:
          apiUrl = 'trade';
        default:
      }
      const _data = Array.from(Array(6)).map((_, index) => {
        return fakeData[index % 3];
      });
      setData([...data, ..._data]);
      setIsFetching(false);
    }, 2000);
  };

  const [isFetching, setIsFetching] = useInfiniteScroll(
    containerRef,
    fetchData
  );

  const renderData = () => {
    return data.map((item, index) => <Item data={item} key={index} />);
  };

  const renderSkeleton = () => {
    if (isFetching) {
      return (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      );
    }
  };
  return (
    <div ref={containerRef} className={styles.wrap}>
      <Stack gap="10px">
        {renderData()}
        {renderSkeleton()}
      </Stack>
    </div>
  );
};

export default ProfileDetailTrade;
