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
import HuntChainActions from 'components/Sniping/Platform/SavedHunts/RunningHunts/components/HuntChainActions';
import CustomTooltip from 'components/common/CustomTooltip';
import { ValueDisplay } from '../elements/ValueDisplay';

const InstinctAlert = ({
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
  huntType,
  handleAddChainEvent,
  handleAddChainLogic,
  chainEvents,
  handleDeleteChainEvent,
  handleSwitchEditingChainEvent,
  currentEditingChainEvent,
  handleUpdateEditingChainEvent,
  editingChainEvent,
}) => {
  const {
    state: { editType },
  } = useContext(SearchContext);
  const {
    state: { user },
  } = useContext(AuthContext);

  const anchorEl = useRef(null);
  const collectionRule = selectedRules.find(
    (rule) => rule.label === 'collection'
  );

  return (
    <>
      <HuntRule
        collection={collectionRule}
        rule={collectionRule}
        onChange={handleUpdateEditingRule}
      />
      <RulesPopover
        anchor={anchorEl}
        open={openedPopover}
        handleClose={handlePopoverClose}
        handleOpen={handlePopoverOpen}
        handleClick={handleCreateRule}
        selectedRules={selectedRules}
        huntType="hunt"
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
            Instinct Hunt Actions
          </span>
          <CustomTooltip
            title="Only works for combined with auto-buy. You can chain multiple actions together to create a more complex hunt."
            placement="right"
          />
        </Box>

        <HuntChainActions
          search={{ rules: selectedRules }}
          editingChainEvent={editingChainEvent}
          handleAddChainEvent={handleAddChainEvent}
          handleAddChainLogic={handleAddChainLogic}
          chainEvents={chainEvents}
          handleSwitchEditingChainEvent={handleSwitchEditingChainEvent}
          handleDeleteChainEvent={handleDeleteChainEvent}
          huntType="instinct"
          currentEditingChainEvent={currentEditingChainEvent}
          handleUpdateEditingChainEvent={handleUpdateEditingChainEvent}
        />
      </Box>
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

export default InstinctAlert;
