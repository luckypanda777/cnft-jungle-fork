import { Box } from '@mui/material';
import Select from '../../common/Select';
import styles from './RankingMethod.module.scss';
import FilterInput from '../../common/Input';
import AcceptButton from '../../buttons/AcceptButton/Button';
import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useAppContext } from '../../../context/AppContext';

const methods = [
  { label: 'Rarity Score', value: 'score' },
  { label: 'Trait Rarity', value: 'trait' },
  { label: 'Statistical Rarity', value: 'statistical' },
  { label: 'Average Rarity', value: 'average' },
];

const RankingMethod = ({ onRankingFilter }) => {
  const { state } = useAppContext();
  const [method, setMethod] = useState('score');
  const [normalization, setNormalization] = useState(false);
  const [weightings, setWeightings] = useState(false);
  const [traitCount, setTraitCount] = useState(false);
  const [json, setJson] = useState('');
  const [mismatch, setMismatch] = useState(false);

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
  };

  const handleNormalization = (e) => {
    setNormalization(e.target.checked);
  };

  const handleTraitCount = (e) => {
    setTraitCount(e.target.checked);
  };

  const handleWeightings = (e) => {
    if (mismatch) {
      setMismatch(false);
    }
    setWeightings(e.target.checked);
  };

  const handleJson = (e) => {
    if (mismatch) {
      setMismatch(false);
    }
    setJson(e.target.value);
  };

  const handleApply = () => {
    try {
      const parsedJson = JSON.parse(json);

      const collectionsKeys = Object.keys(state.collection.traitlist);
      const userKeys = Object.keys(parsedJson);

      let error = false;

      // for weightings textarea
      const newJson = { ...parsedJson };
      // for request
      const requestWeightings = {};

      userKeys.forEach((key) => {
        const includesKey = collectionsKeys.find((c) => c.includes(key));
        /*
				 og - attributes / Head
				 user - Head
				 */
        if (includesKey) {
          requestWeightings[includesKey] = parsedJson[key];
        } else {
          requestWeightings[key] = parsedJson[key];
        }

        if (!collectionsKeys.includes(key) && !includesKey) {
          error = true;
          delete newJson[key];
        }
      });

      if (error) {
        setMismatch(true);
        console.error('trait key mismatch');
        setJson(JSON.stringify(newJson, undefined, 4));
        return;
      }

      const filtersInfo = {
        type: method,
        traitNormalization: normalization,
        traitCount,
        additionalWeighting: weightings,
        weightingsApplied: weightings ? { ...requestWeightings } : {},
      };

      onRankingFilter(filtersInfo);
    } catch (e) {
      console.error('Failed to parse traits weightings json');
    }
  };

  useEffect(() => {
    const traits = Object.entries(state.collection.traitlist);
    const example = {};

    if (traits.length) {
      const [first, second] = traits;

      [first, second].forEach(([label, values], i) => {
        if (label !== 'traitcount') {
          example[label] = i > 0 ? 2 : 1;
        }
      });
    }

    setJson(JSON.stringify(example, undefined, 4));
  }, []);

  useEffect(() => {
    if (json) {
      const parsedJson = JSON.parse(json);

      if (traitCount) {
        parsedJson.traitcount = 1;
      } else {
        delete parsedJson.traitcount;
      }

      setJson(JSON.stringify(parsedJson, undefined, 4));
    }
  }, [traitCount]);

  return (
    <Box>
      <Select
        options={methods}
        name="type"
        value={method}
        onChange={handleMethodChange}
        style={{ width: 220 }}
      />
      <Box className={styles.checkboxSetting}>
        <FormControlLabel
          label="Trait Normalization"
          control={
            <Checkbox checked={normalization} onChange={handleNormalization} />
          }
        />
        <FormControlLabel
          label="Include Trait Count"
          control={
            <Checkbox checked={traitCount} onChange={handleTraitCount} />
          }
        />
        <FormControlLabel
          label="Additional Weighting"
          control={
            <Checkbox checked={weightings} onChange={handleWeightings} />
          }
        />
        {weightings ? (
          <>
            <FilterInput
              value={json && json.length ? json : undefined}
              onChange={handleJson}
              multiline
              rows={5}
            />
            <div className={styles.traitMismatch}>
              {mismatch ? (
                <span className={styles.traitMismatchText}>
                  Trait key mismatch
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </Box>
      <Box className={styles.acceptBtn}>
        <AcceptButton onClick={handleApply}>Apply</AcceptButton>
      </Box>
    </Box>
  );
};

export default RankingMethod;
