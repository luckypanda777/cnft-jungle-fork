import { Box } from '@mui/system';
import { ruleIcons } from 'components/Sniping/Platform/NFTHunt/hunt-rules';
import CustomTooltip from 'components/common/CustomTooltip';
import { ValueDisplay } from 'components/Sniping/Platform/NFTHunt/elements/ValueDisplay';

const HuntSummary = ({ search }) => {
  const { rules } = search;

  const displayRules =
    rules.filter((rule) => rule.type !== 'boolean').length === 1
      ? [...rules, { type: 'string', label: 'any', value: 'Yes' }]
      : rules;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
          Should trigger if
        </span>
        <CustomTooltip
          title="Combination of rules that if all matched should trigger the alert."
          placement="right"
        />
      </Box>
      <Box
        sx={{
          mt: 1,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {displayRules.map(({ label, type, value }, index) => {
          if (!value) return null;

          return (
            <>
              <Box
                key={label}
                sx={{
                  padding: '10px 15px',
                  border: '1px solid var(--fontColor)',
                  color: 'var(--fontColor)',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  columnGap: 1,
                  fontFamily: 'newgilroysemibold',
                  lineHeight: 1,
                }}
              >
                <Box sx={{ p: '0' }}>{ruleIcons[label]}</Box>
                <ValueDisplay type={type} label={label} value={value} />
              </Box>
              {/* {index !== displayRules.length - 1 && '&'} */}
            </>
          );
        })}
      </Box>
    </>
  );
};

export default HuntSummary;
