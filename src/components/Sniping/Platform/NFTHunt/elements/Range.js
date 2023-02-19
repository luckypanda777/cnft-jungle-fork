import { FormControl, Slider } from '@mui/material';
import { Box } from '@mui/system';

function valuetext(value) {
  return `${value} Rank`;
}

const marks = (range) => [
  {
    value: range[0],
    label: range[0] * 100 + 1 + ' Rank',
  },
  {
    value: range[1],
    label: range[1] * 100 + ' Rank',
  },
];

const Floor = ({ range, setRange }) => {
  const minDistance = 100 / 100;
  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setRange([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setRange([clamped - minDistance, clamped]);
      }
    } else {
      setRange(newValue);
    }
  };

  return (
    <FormControl
      sx={{
        width: 300,
        mt: 4,
        mb: -2,
        fontFamily: 'newgilroymedium',
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      {/* <Typography
        id="input-slider"
        gutterBottom
        sx={{
          fontSize: 14,
          fontWeight: 'medium',
          letterSpacing: 0,
          color: 'whitesmoke',
          fontFamily: "newgilroymedium",
          px: 0,
          mb: 2,
        }}
      >
        Hunt within rank range
      </Typography> */}
      <Box
        sx={{
          width: 280,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: 'newgilroymedium',
        }}
      >
        <Slider
          getAriaLabel={() => 'Price range'}
          value={range}
          onChange={handleChange}
          getAriaValueText={valuetext}
          valueLabelDisplay="off"
          marks={marks(range)}
          sx={{
            'span.MuiSlider-markLabel': {
              top: '30px',
              color: 'whitesmoke',
              fontFamily: 'newgilroymedium',
              fontSize: 12,
            },
            'span.MuiSlider-markLabel ~ span.MuiSlider-markLabel': {
              top: '-20px',
              color: 'whitesmoke',
              fontFamily: 'newgilroymedium',
              fontSize: 12,
            },
          }}
        />
      </Box>
    </FormControl>
  );
};
export default Floor;
