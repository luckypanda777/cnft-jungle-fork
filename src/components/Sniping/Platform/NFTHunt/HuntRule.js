import { Box, IconButton, Chip, capitalize } from '@mui/material';
import CustomTooltip from 'components/common/CustomTooltip';
import Input from 'components/common/Input';
import Select from 'components/common/Select';
import { useMemo } from 'react';
import { Collections, Check, CollectionTraits } from '../common';
import ClearIcon from '@mui/icons-material/Clear';
import CollectionTraitCategories from '../common/CollectionTraitCategories';

const highlight = (text) => {
  return <span style={{ color: 'var(--primaryColor)' }}>{text}</span>;
};

const HuntRule = ({ rule, onChange, collection, actionType }) => {
  if (!rule || Object.keys(rule).length === 0) return null;

  const { name, label, type, description } = rule;

  const ruleTitle = useMemo(() => {
    if (label === 'collection') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
            {rule.value ? 'Selected Collection' : 'Choose collection'}
          </span>
          <CustomTooltip
            title="Collection name or policy to create the background alert for. Required rule."
            placement="right"
          />
        </Box>
      );
    }

    return (
      <span
        style={{
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          columnGap: 5,
          fontFamily: 'newgilroymedium',
        }}
      >
        {actionType ? capitalize(`${actionType} if`) : ''}
        {highlight(name)} Rule Details{' '}
        <CustomTooltip title={description} placement="top" />
      </span>
    );
  }, [rule]);

  const ruleDisplay = useMemo(() => {
    if (label === 'collection') {
      const isValid =
        rule.value?.policies?.length === 56 ||
        rule.value?.policies === 'All Collections';
      const name = rule.value?.name;

      return (
        <Box sx={{ display: 'flex', rowGap: 1, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <span>Name: {name || 'Not Selected'}</span>
            <span>
              Policy:{' '}
              <span
                style={{
                  color: isValid
                    ? 'var(--fontColor)'
                    : 'var(--overvaluedColor)',
                }}
              >
                {isValid ? highlight(rule.value.policies) : 'Invalid'}
              </span>
            </span>
          </Box>
          <Collections
            setError={() => {}}
            setCollection={(collection) => onChange(label, collection)}
          />
        </Box>
      );
    }

    if (type === 'boolean') {
      return (
        <Box sx={{ display: 'flex', rowGap: 1, flexDirection: 'column' }}>
          <Check
            title={name}
            onChange={(checked) => onChange(label, checked)}
            defaultValue={true}
            value={rule.value}
          />
        </Box>
      );
    }

    if (type === 'select') {
      return (
        <Box sx={{ display: 'flex', rowGap: 1, flexDirection: 'column' }}>
          <Select
            options={[
              { label: 'cnft.tools', value: 'tools' },
              { label: 'cnftjungle', value: 'jungle' },
            ]}
            value={rule.value || 'jungle'}
            onChange={(e) => onChange(label, e.target.value)}
          />
        </Box>
      );
    }

    if (type === 'traits') {
      return (
        <Box sx={{ display: 'flex', rowGap: 0.5, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {(rule.value || []).map((trait, i) => (
              <Chip
                key={i}
                label={
                  <span
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 10,
                    }}
                  >
                    {trait.replace('attributes / ', '')}
                    <IconButton
                      size="small"
                      sx={{ p: 0, ml: 0.5 }}
                      onClick={() =>
                        onChange(
                          label,
                          rule.value.filter((t) => t !== trait),
                          'delete'
                        )
                      }
                    >
                      <ClearIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </span>
                }
                sx={{ m: 0.25, width: 'fit-content' }}
                variant="outlined"
                // onDelete={() => updateBackgroundSearchTraits(trait)}
              />
            ))}
          </Box>
          <CollectionTraits
            sx={{ mt: 1 }}
            setError={() => {}}
            collectionId={collection?.value?.id}
            selectedTraits={rule.value || []}
            setSelectedTraits={(traits) => onChange(label, traits)}
          />
        </Box>
      );
    }

    if (type === 'traitCategories') {
      console.log(collection);
      return (
        <Box sx={{ display: 'flex', rowGap: 0.5, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {(rule.value || []).map((trait, i) => (
              <Chip
                key={i}
                label={
                  <span
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      columnGap: 10,
                    }}
                  >
                    {trait.replace('attributes / ', '')}
                    <IconButton
                      size="small"
                      sx={{ p: 0, ml: 0.5 }}
                      onClick={() =>
                        onChange(
                          label,
                          rule.value.filter((t) => t !== trait)
                        )
                      }
                    >
                      <ClearIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </span>
                }
                sx={{ m: 0.25, width: 'fit-content' }}
                variant="outlined"
                // onDelete={() => updateBackgroundSearchTraits(trait)}
              />
            ))}
          </Box>
          <CollectionTraitCategories
            sx={{ mt: 1 }}
            collectionId={collection?.value?.id}
            selectedTraits={rule.value || []}
            setSelectedTraits={(traits) => onChange(label, traits)}
          />
        </Box>
      );
    }

    if (type === 'number' || type === 'string') {
      return (
        <Box sx={{ display: 'flex', rowGap: 1, flexDirection: 'column' }}>
          <Input
            name={name}
            type={type}
            value={rule.value}
            onChange={(e) => onChange(label, e.target.value)}
            defaultValue={rule.defaultValue}
            placeholder={rule.placeholder}
          />
        </Box>
      );
    }
  }, [rule]);

  return (
    <Box
      sx={{
        maxWidth: 550,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 1,
      }}
    >
      {ruleTitle}
      {ruleDisplay}
    </Box>
  );
};

export default HuntRule;
