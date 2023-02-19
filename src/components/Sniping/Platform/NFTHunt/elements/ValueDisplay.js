import { Chip } from '@mui/material';
import { ruleLabels } from '../hunt-rules';

export const ValueDisplay = ({ label, value, type, editingRule = '' }) => {
  let display = null;

  if (label === 'collection') {
    display = value?.name;
  }

  if (type === 'string' || type === 'number') {
    display = value && value?.toString();
  }

  if (type === 'boolean') {
    display = value !== null && (value ? 'Yes' : 'No');
  }

  if (type === 'traits' || type === 'traitCategories') {
    display = value?.map((trait) => (
      <Chip label={trait} size="small" sx={{ height: 20 }} />
    ));
  }

  // if (type === 'logic') {
  //   return (
  //     <span
  //       style={{
  //         textTransform: 'uppercase',
  //         color: editingRule === label ? 'white' : '#BDBEC6',
  //       }}
  //     >
  //       {ruleLabels[label]}
  //     </span>
  //   );
  // }

  if (label === 'actionAmount') {
    display = (value || 'All') + (value === 1 ? ' NFT' : ' NFTs');
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        columnGap: 5,
      }}
    >
      <span style={{ color: editingRule === label ? 'white' : '#BDBEC6' }}>
        {ruleLabels[label]}:{' '}
      </span>
      <span
        style={{
          color: editingRule === label ? 'white' : 'var(--fontColor)',
          wordBreak: 'break-word',
          display: 'flex',
          columnGap: 5,
        }}
      >
        {display || 'Not Selected'}
      </span>
    </div>
  );
};
