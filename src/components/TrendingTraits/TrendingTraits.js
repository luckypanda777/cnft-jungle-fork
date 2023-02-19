import { useEffect, useState } from 'react';
import {
  Box,
  capitalize,
  Chip,
  Skeleton,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { shorten } from 'utils/shorten';
import { useAppContext } from 'context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';
import { getTraitAnalytics } from 'apiProvider';

const RANGE_MAPPING = {
  '7d': 'week',
  '30d': 'month',
  '90d': 'threemonth',
  '1y': 'year',
};

const TraitOption = ({
  label,
  isSelected,
  traitKey,
  traitValue,
  onChange,
  style,
  hits,
}) => {
  return (
    <FormControlLabel
      sx={{ width: '100%', ...style }}
      control={
        <Checkbox
          checked={Boolean(isSelected)}
          onChange={(e) =>
            onChange(
              capitalize(traitKey || '')
                .replace('Attributes', 'attributes')
                .replace('Traitcount', 'traitcount'),
              traitValue.toLowerCase(),
              e.target.checked
            )
          }
        />
      }
      //traits=%7B"Attributes+%2F+Back"%3A%5B"scythe"%5D%7D
      //traits=%7B"Attributes+%2F+Back"%3A%5B"scythe"%5D%7D
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'newgilroymedium',
            fontSize: 14,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <CustomTooltip
              title={`${capitalize(
                (traitKey === 'traitcount'
                  ? 'Trait Count'
                  : traitKey || ''
                ).replace('Attributes / ', '')
              )} / ${capitalize(traitValue || '')}`}
            >
              <span>
                {shorten(
                  `${capitalize(
                    (traitKey === 'traitcount'
                      ? 'Trait Count'
                      : traitKey || ''
                    ).replace('Attributes / ', '')
                  )} / ${capitalize(traitValue || '')}`,
                  25
                )}
              </span>
            </CustomTooltip>
          </Box>
          <Box>
            <Chip
              label={`${hits} times`}
              size="small"
              variant="outlined"
              sx={{
                ml: 1,
                fontSize: 12,
                fontWeight: 500,
                height: 20,
                fontFamily: 'newgilroymedium',
              }}
            />
          </Box>
        </Box>
      }
    />
  );
};

const TrendingTraits = ({
  collection,
  onTraitOptionFilter,
  toggleSelectAllTraits,
  selectedTraits,
}) => {
  const {
    state: { isMobile },
  } = useAppContext();

  const traitlist = Object.entries(collection?.traitlist || {});
  const [traits, setTraits] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState('30d');

  useEffect(() => {
    setTraits(traitlist);
  }, [collection]);

  useEffect(() => {
    fetchTrendingTraits();
  }, [collection]);

  const fetchTrendingTraits = async (period = 'month') => {
    setLoading(true);
    try {
      const response = await getTraitAnalytics({
        collectionId: collection.id,
        period,
      }).then((res) => res.trending);

      setTrending(response || []);
    } catch (err) {
      console.log(err);
      setTrending([]);
    }
    setLoading(false);
  };

  const handleSetRange = (period) => {
    setRange(period);
    const subtractPeriod = RANGE_MAPPING[period];
    fetchTrendingTraits(subtractPeriod);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>Trend range</span>
        <Box
          sx={{
            display: 'flex',
            columnGap: 1,
          }}
        >
          {['7d', '30d', '90d', '1y'].map((period) => (
            <Box key={period}>
              <span
                style={{
                  color:
                    period === range ? 'var(--logoColor)' : 'var(--fontColor)',
                  textDecoration: period === range && 'underline',
                  textDecorationColor:
                    period === range ? 'var(--logoColor)' : 'var(--fontColor)',
                  cursor: 'pointer',
                }}
                onClick={() => handleSetRange(period)}
              >
                {capitalize(period)}
              </span>
            </Box>
          ))}
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />
      {loading ? (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            rowGap: 1,
          }}
        >
          {new Array(10).fill(0).map((a) => (
            <Skeleton
              width={`${parseInt((Math.random() + 0.5) * 60)}%`}
              height={30}
              variant="text"
            />
          ))}
        </Box>
      ) : trending.length === 0 ? (
        <Box sx={{ textAlign: 'center' }}>No traits found</Box>
      ) : (
        trending?.map(({ traitKey, traitValue, hits }, index) => (
          <TraitOption
            onChange={onTraitOptionFilter}
            key={traitKey + index}
            isSelected={selectedTraits[
              capitalize(traitKey || '')
                .replace('Attributes', 'attributes')
                .replace('Traitcount', 'traitcount')
            ]?.includes(traitValue.toLowerCase())}
            traitKey={traitKey}
            traitValue={traitValue}
            hits={hits}
          />
        ))
      )}
    </>
  );
};

export default TrendingTraits;
