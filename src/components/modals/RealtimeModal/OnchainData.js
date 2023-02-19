import { Box, Button, Tooltip } from '@mui/material';
import CustomTooltip from 'components/common/CustomTooltip';
import { shorten } from 'utils/shorten';
import styles from './Modal.module.scss';

const OnchainDataBox = ({ name, value }) => {
  if (!name || !value) return null;

  // check if value is an object
  if (typeof value === 'object') {
    // return recursively onchaindatabox
    return (
      <Box className={styles.assetOnchainData}>
        {Object.keys(value).map((key) => {
          return <OnchainDataBox key={key} name={key} value={value[key]} />;
        })}
      </Box>
    );
  }

  return (
    <Box className={[styles.onchainData]}>
      <Box className={styles.info}>
        <CustomTooltip title={`Data name: ${name}`} placement="top">
          <span className={styles.slot}>{shorten(name, 30)}</span>
        </CustomTooltip>
        <CustomTooltip title={`Data value: ${value}`} placement="bottom">
          <span className={styles.name}>{value.toString()}</span>
        </CustomTooltip>
      </Box>
    </Box>
  );
};

const OnchainData = ({ onchainData }) => {
  if (Object.values(onchainData || {}).length === 0) return null;

  if (typeof onchainData === 'string') {
    onchainData = JSON.parse(onchainData);
  }

  function flattenObj(obj, parentKey = null, res = {}) {
    for (let key in obj) {
      const propName = parentKey ? parentKey + '.' + key : key;
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        flattenObj(obj[key], propName, res);
      } else if (Array.isArray(obj[key])) {
        // if array, flatten array

        obj[key].forEach((item, index) => {
          const propName = parentKey
            ? parentKey + '.' + key + '.' + index
            : key + '.' + index;
          if (typeof item === 'object' && !Array.isArray(item)) {
            flattenObj(item, propName, res);
          }
        });
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  }

  const flattenedOnchainDdata = flattenObj(onchainData);

  return (
    <Box className={styles.assetOnchainData}>
      {Object.entries(flattenedOnchainDdata).map(([name, value], i) => {
        return <OnchainDataBox key={i} name={name} value={value} />;
      })}
    </Box>
  );
};

export default OnchainData;
