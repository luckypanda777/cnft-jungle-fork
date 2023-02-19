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
import { getGlobalTraitAnalytics } from 'apiProvider';
import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import { useRouter } from 'next/router';
import { avatarStyle } from 'utils/globalStyles';
import FilterButton from 'components/buttons/FilterButton';
import useWindowSize from 'hooks/useWindowSize';

const RANGE_MAPPING = {
  '24h': 'day',
  '7d': 'week',
  '30d': 'month',
  '90d': 'threemonth',
  '1y': 'year',
};

const TraitOption = ({
  traitKey,
  traitValue,
  hits,
  onClick,
  name,
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
      <Avatar alt={name} sx={{ ...avatarStyle, width: 40, height: 40 }}>
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
            `${capitalize(
              (traitKey === 'traitcount' ? 'Trait Count' : traitKey).replace(
                'Attributes / ',
                ''
              )
            )} / ${capitalize(traitValue)}`,
            isMobile
              ? 25
              : window.innerWidth > 1600
              ? 35
              : window.innerWidth > 1200
              ? 30
              : 25
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
          <span>{hits}</span>
        </Box>
      </Box>
    </Box>
  );
};

const GlobalTrendingsTraits = () => {
  const {
    state: { isMobile },
  } = useAppContext();

  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [range, setRange] = useState('24h');
  const { width } = useWindowSize();

  useEffect(() => {
    fetchGlobalTrendingsTraits();
  }, []);

  const fetchGlobalTrendingsTraits = async (period = 'day') => {
    setLoading(true);
    try {
      const response = await getGlobalTraitAnalytics({ period }).then((res) =>
        res.success ? res.trending : []
      );

      setTrending(response);
    } catch (err) {
      console.log(err);
      setTrending([]);
    }
    setLoading(false);
  };

  const handleTraitClick = ({ traitKey, traitValue, policies }) => {
    router.push(
      `/collections/${policies}?traits=${JSON.stringify({
        [capitalize(traitKey)
          .replace('Attributes', 'attributes')
          .replace('Traitcount', 'traitcount')]: [traitValue.toLowerCase()],
      })}`
    );
  };

  const handleSetRange = (period) => {
    setRange(period);
    const subtractPeriod = RANGE_MAPPING[period];
    fetchGlobalTrendingsTraits(subtractPeriod);
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
        <span style={{ fontSize: 18 }}>Most searched traits ({range})</span>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            columnGap: 1,
          }}
        >
          {['24h', '7d', '30d', '90d', '1y'].map((period) => (
            <Box
              key={period}
              sx={{
                color:
                  period === range ? 'var(--logoColor)' : 'var(--fontColor)',
                textDecoration: period === range && 'underline',
                textDecorationColor:
                  period === range ? 'var(--logoColor)' : 'var(--fontColor)',
                cursor: 'pointer',
                '&:hover': {
                  color: 'var(--logoColor)',
                },
              }}
              onClick={() => handleSetRange(period)}
            >
              {capitalize(period)}
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
      ) : trending.length === 0 ? (
        <Box sx={{ textAlign: 'center' }}>No traits found</Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {trending
            ?.slice(0, isMobile ? 6 : width < 1400 ? 12 : 14)
            .map((trend, index) => {
              return (
                <TraitOption
                  onClick={() => handleTraitClick(trend)}
                  key={trend.traitKey + index}
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

export default GlobalTrendingsTraits;
