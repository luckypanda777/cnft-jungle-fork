import { useContext, useRef } from 'react';
import { Box, capitalize, Divider, IconButton } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import RulesPopover from '../RulesPopover';
import HuntRule from '../HuntRule';
import Input from 'components/common/Input';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as AuthContext } from 'context/AuthContext';
import { ruleMapping, rulePresets } from '../hunt-rules';
import ClearIcon from '@mui/icons-material/Clear';
import Select from 'components/common/Select';
import HuntPreview from 'components/Sniping/Platform/SavedHunts/RunningHunts/components/HuntPreview';
import CustomTooltip from 'components/common/CustomTooltip';
import { ValueDisplay } from '../elements/ValueDisplay';

const HuntAlert = ({
  handlePopoverOpen,
  handlePopoverClose,
  handleSwitchEditingRule,
  handleUpdateEditingRule,
  handleCreateRule,
  handleDeleteRule,
  currentEditingRule,
  editingRule,
  huntLabel,
  huntlistName,
  selectedRules,
  openedPopover,
  setHuntLabel,
  setHuntlistName,
  setSelectedRules,
}) => {
  const {
    state: { editType },
  } = useContext(SearchContext);
  const {
    state: { user },
  } = useContext(AuthContext);

  const anchorEl = useRef(null);
  const collection = selectedRules.find((rule) => rule.label === 'collection');

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
            Select Default Zing Preset
          </span>
          <CustomTooltip
            title="Select predefined set of most commonly used rules. You can combine all the presets together as well as add any new rules."
            placement="right"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            columnGap: 1,
            justifyContent: 'flex-start',
            maxWidth: '100%',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {[
            'floor',
            'Daily Volume',
            'Weekly Volume',
            'Monthly Volume',
            'listings',
          ].map((name) => {
            const rulePreset = rulePresets[name];
            const hasPermissions = ruleMapping[rulePreset.permissions].includes(
              user?.snipeTier
            );

            if (!hasPermissions) {
              return (
                <CustomTooltip
                  title={`Only available for ${rulePreset.permissions} tier!`}
                  placement="bottom"
                >
                  <FilterButton
                    // add small shadow
                    sx={{
                      fontSize: 12,
                      border: 'none',
                      cursor: 'not-allowed',
                      backgroundColor: 'var(--lightGrey)',
                      color: 'var(--fontColor)',
                      '&:hover': {
                        color: 'white',
                        opacity: 0.9,
                      },
                    }}
                    pressable
                    name={name}
                  >
                    {capitalize(name)}
                  </FilterButton>
                </CustomTooltip>
              );
            }

            return (
              <FilterButton
                // add small shadow
                sx={{
                  fontSize: 12,
                  border: 'none',
                  backgroundColor: 'var(--lightGrey)',
                  color: 'var(--fontColor)',
                  '&:hover': {
                    backgroundColor: 'var(--logoColor)',
                    color: 'white',
                    opacity: 0.9,
                  },
                }}
                onClick={() =>
                  setSelectedRules(
                    [...selectedRules, ...(rulePreset?.rules || [])].filter(
                      (thing, index, self) =>
                        index === self.findIndex((t) => t.label === thing.label)
                    )
                  )
                }
                pressable
                name={name}
              >
                {capitalize(name)}
              </FilterButton>
            );
          })}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
            Add Hunt Rules
          </span>
          <CustomTooltip
            title="Set values for the rules as well as add new ones. You can also remove any rules you don't need."
            placement="right"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            columnGap: 1,
            justifyContent: 'flex-start',
            // py: 1,
            maxWidth: '100%',
            flexWrap: 'wrap',
            gap: 1,
          }}
        >
          {selectedRules.map(({ name, label, type, value }) => {
            return (
              <>
                <FilterButton
                  key={label}
                  sx={{
                    maxWidth: '100%',
                    fontSize: 12,
                    border: 'none',
                    backgroundColor:
                      editingRule === label
                        ? 'var(--primaryColor)'
                        : 'var(--lightGrey)',
                    color: editingRule === label ? 'white' : 'var(--bgColor)',
                  }}
                  pressable
                  name={name}
                  value={editingRule === label}
                  onClick={() => handleSwitchEditingRule(label)}
                >
                  <ValueDisplay
                    name={name}
                    type={type}
                    label={label}
                    value={value}
                    editingRule={editingRule}
                  />
                  {label !== 'collection' && (
                    <IconButton
                      sx={{ p: 0, ml: 0.25 }}
                      onClick={() => handleDeleteRule(label)}
                    >
                      <ClearIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </FilterButton>
              </>
            );
          })}
          {false ? (
            <CircularProgress size={18} sx={{ p: 0.75 }} />
          ) : (
            <FilterButton
              // add small shadow
              sx={{
                fontSize: 12,
                border: '2px solid var(--logoColor)',
                color: 'white',
                '&:hover': {
                  border: '2px solid var(--logoColor)',
                  color: 'white',
                  opacity: 0.9,
                },
              }}
              pressable
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              ref={anchorEl}
            >
              + New Rule
            </FilterButton>
          )}
        </Box>
      </Box>
      <HuntRule
        rule={currentEditingRule}
        onChange={handleUpdateEditingRule}
        collection={collection}
        actionType="Ping"
      />
      <RulesPopover
        anchor={anchorEl}
        open={openedPopover}
        handleClose={handlePopoverClose}
        handleOpen={handlePopoverOpen}
        handleClick={handleCreateRule}
        selectedRules={selectedRules}
        huntType="zing"
      />

      <Divider sx={{ width: '100%', mx: 'auto', mt: 1 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          rowGap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
            Preview Hunt Results
          </span>
          <CustomTooltip
            title="Hunt Previews is an experimental feature that allows you to preview the results of your hunt before you start it. This feature is still in development and may not work as expected with all rules. Please report any bugs you find."
            placement="right"
          />
        </Box>

        <HuntPreview search={{ rules: selectedRules }} minified={false} />
      </Box>

      <Box
        sx={{
          display: 'flex',
          columnGap: 2,
          width: '100%',
          pr: 3,
          justifyContent: 'flex-start',
        }}
      >
        {editType !== 'all' && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
                Set Hunt Label
              </span>
              <CustomTooltip
                title="Create a label for your hunt. This label will be used to identify your hunt in the hunt list and on the snipe page."
                placement="right"
              />
            </Box>
            <Input
              placeholder="Create hunt label (optional)"
              value={huntLabel}
              onChange={(e) => setHuntLabel(e.target.value)}
              sx={{ width: 300 }}
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
              Set Hunt Folder
            </span>
            <CustomTooltip
              title="Create a folder for your hunt. This folder will be used to organize your hunt in the hunt list."
              placement="right"
            />
          </Box>
          <Select
            options={[
              { label: 'No List', value: '' },
              ...(user?.huntlistNames || [])?.map((name) => ({
                label: name,
                value: name,
              })),
            ]}
            value={huntlistName || ''}
            onChange={(e) => setHuntlistName(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>
      </Box>
    </>
  );
};

export default HuntAlert;
