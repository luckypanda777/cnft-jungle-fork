import { useEffect, useState } from 'react';
import {
  Box,
  capitalize,
  Typography,
  CircularProgress,
  Divider,
  Avatar,
  Skeleton,
} from '@mui/material';
import { shorten } from 'utils/shorten';
import { useAppContext } from 'context/AppContext';
import { getGlobalSnipedCollections } from 'apiProvider';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { useRouter } from 'next/router';
import { avatarStyle } from 'utils/globalStyles';
import FilterButton from 'components/buttons/FilterButton';
import useWindowSize from 'hooks/useWindowSize';

const TraitOption = ({
  snipes,
  onClick,
  collection_name,
  image,
  isMobile,
  index,
}) => {
  const { width } = useWindowSize();

  return (
    <Box
      sx={{
        // border: '1px solid var(--primaryColor)',
        borderRadius: '10px',
        display: 'flex',
        flex: 1,
        minWidth: width < 900 ? '45%' : width < 1200 ? '20%' : '12.5%',
        '&:hover': { cursor: 'pointer' },
        alignItems: 'center',
        // border: '2px solid var(--primaryColor)',
        padding: '5px',
      }}
      onClick={onClick}
    >
      {/* <span style={{ marginRight: 5 }}>{index + 1}</span> */}
      <Avatar
        alt={collection_name}
        sx={{ ...avatarStyle, width: 40, height: 40 }}
      >
        <ImageWithErrorHandler
          src={image}
          alt="unsupported"
          style={{ width: 20, height: 20 }}
          nextImg
          layout="fill"
        />
      </Avatar>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flex: 1,
          fontFamily: 'newgilroymedium',
          flexDirection: 'column',
          rowGap: 0.5,
        }}
      >
        <span
          style={{
            fontSize: '1rem',
            flex: 3,
            pr: 1,
            fontSize: width < 1400 ? 12 : 14,
          }}
        >
          {shorten(
            collection_name,
            isMobile
              ? 20
              : window.innerWidth > 1600
              ? 30
              : window.innerWidth > 1200
              ? 25
              : 20
          )}
        </span>
        <Box
          sx={{
            display: 'flex',
            columnGap: 0.5,
            fontSize: 12,
            fontFamily: 'newgilroysemibold',
            letterSpacing: 0.25,
          }}
        >
          <span
            style={{
              flex: 1,
              textAlign: 'right',
              color: 'var(--rankGrey)',
            }}
          >
            Times:{' '}
          </span>
          <span>{snipes}</span>
        </Box>
      </Box>
    </Box>
  );
};

const GlobalSnipedCollections = () => {
  const {
    state: { isMobile },
  } = useAppContext();

  const [sniped, setSniped] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [type, setType] = useState('active');
  const { width } = useWindowSize();

  useEffect(() => {
    fetchGlobalSnipedCollections('active');
  }, []);

  const fetchGlobalSnipedCollections = async (type) => {
    setLoading(true);
    try {
      const response = await getGlobalSnipedCollections({
        isHistory: type === 'history',
      }).then((res) => (res.success ? res.sniped : []));

      setSniped(response);
    } catch (err) {
      console.log(err);
      setSniped([]);
    }

    setLoading(false);
  };

  const handleTraitClick = ({ policies }) => {
    router.push(`/collections/${policies}`);
  };

  const handleTypeChange = (period) => {
    setType(period);
    fetchGlobalSnipedCollections(period);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'var(--bgColor)',
        borderRadius: '6px',
        padding: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 18, display: 'flex', columnGap: 10 }}>
          Most sniped collections ({type})
          <Box
            sx={{
              fontSize: 14,
              mr: 2,
              width: 'fit-content',
              borderBottom: '2px solid var(--logoColor)',
              fontFamily: 'newgilroysemibold',
              cursor: 'pointer',
              '&:hover': {
                color: 'var(--logoColor)',
              },
            }}
            onClick={() => router.push('/sniping')}
          >
            Snipe Now
          </Box>
        </span>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            columnGap: 1,
          }}
        >
          {['active', 'history'].map((period) => (
            <Box
              key={period}
              sx={{
                color:
                  period === type ? 'var(--logoColor)' : 'var(--fontColor)',
                textDecoration: period === type && 'underline',
                textDecorationColor:
                  period === type ? 'var(--logoColor)' : 'var(--fontColor)',
                cursor: 'pointer',
                '&:hover': {
                  color: 'var(--logoColor)',
                },
              }}
              onClick={() => handleTypeChange(period)}
            >
              {capitalize(period === 'history' ? 'Last Week' : period)}
            </Box>
          ))}
        </Box>
      </Box>
      <Divider sx={{ my: 1.5 }} />
      {loading ? (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            rowGap: 2,
          }}
        >
          {isMobile ? (
            <CircularProgress size={22} />
          ) : (
            <>
              <Skeleton height={30} width="100%" sx={{ my: 1 }} />
              <Skeleton height={30} width="100%" sx={{ my: 1 }} />
            </>
          )}
        </Box>
      ) : sniped.length === 0 ? (
        <Box sx={{ textAlign: 'center' }}>No traits found</Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sniped
            ?.slice(0, isMobile ? 6 : width < 1400 ? 12 : 14)
            .map((trend, index) => {
              return (
                <TraitOption
                  onClick={() => handleTraitClick(trend)}
                  key={trend?.policies + index}
                  {...trend}
                  isMobile={isMobile}
                  index={index}
                />
              );
            })}
        </Box>
      )}
    </Box>
  );
};

export default GlobalSnipedCollections;
