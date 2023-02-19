import React, { useMemo, useRef, useState } from 'react';
import FilterButton from 'components/buttons/FilterButton';
import ChainActionsPopover from 'components/Sniping/Platform/NFTHunt/ChainActionsPopover';
import { ValueDisplay } from 'components/Sniping/Platform/NFTHunt/elements/ValueDisplay';
import { Box, capitalize, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import HuntRule from 'components/Sniping/Platform/NFTHunt/HuntRule';

const ChainAction = ({
  actionName,
  actionChainEvents,
  switchEditingChainEvent,
  handleDeleteChainEvent,
  handleAddChainEvent,
  chainEvents,
  actionType,
  setActionType,
  editingChainEvent,
}) => {
  const anchorRef = useRef(null);
  const [openedPopover, setOpenedPopover] = useState(false);

  const handlePopoverOpen = (newActionType) => {
    setOpenedPopover(true);
    setActionType(newActionType);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ py: 1 }}>{capitalize(actionName)} condition</Box>
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
        {actionChainEvents[actionName].map(({ name, label, type, value }) => {
          const isActive =
            label === editingChainEvent.label && actionType === actionName;

          return (
            <>
              <FilterButton
                key={label}
                sx={{
                  maxWidth: '100%',
                  fontSize: 12,
                  border: 'none',
                  backgroundColor: isActive
                    ? 'var(--primaryColor)'
                    : 'var(--lightGrey)',
                  color: isActive ? 'white' : 'var(--bgColor)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                pressable
                name={name}
                value={isActive}
                onClick={() => switchEditingChainEvent(label, actionName)}
              >
                <ValueDisplay
                  name={name}
                  type={type}
                  label={label}
                  value={value}
                  editingRule={editingChainEvent.label}
                />
                {label !== 'collection' && (
                  <IconButton
                    sx={{ p: 0, ml: 0.25 }}
                    onClick={() => handleDeleteChainEvent(label, actionName)}
                  >
                    <ClearIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                )}
              </FilterButton>
            </>
          );
        })}
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
            width: 'fit-content',
          }}
          pressable
          onMouseEnter={() => handlePopoverOpen(actionName)}
          onMouseLeave={handlePopoverClose}
          ref={anchorRef}
        >
          + New {capitalize(actionName)} Condition
        </FilterButton>
      </Box>
      <ChainActionsPopover
        anchor={anchorRef}
        open={openedPopover}
        handleClose={handlePopoverClose}
        handleOpen={() => handlePopoverOpen(actionType)}
        handleClick={handleAddChainEvent}
        chainEvents={chainEvents}
        huntType="instinct"
        actionType={actionType}
      />
    </Box>
  );
};

const HuntChainActions = ({
  search,
  handleAddChainEvent,
  handleAddChainLogic,
  editingChainEvent,
  chainEvents,
  handleSwitchEditingChainEvent,
  handleDeleteChainEvent,
  currentEditingChainEvent,
  handleUpdateEditingChainEvent,
}) => {
  const [actionType, setActionType] = useState('list');

  const switchEditingChainEvent = (chainEvent, newActionType) => {
    console.log('SWITCHING CHAIN EVENT', chainEvent, newActionType);
    setActionType(newActionType);
    handleSwitchEditingChainEvent({
      label: chainEvent,
      actionType: newActionType,
    });
  };

  const getActionChainEvents = (newActionType) => {
    return chainEvents.filter((e) => e.actionType === newActionType);
  };

  const actionChainEvents = useMemo(() => {
    return {
      list: getActionChainEvents('list'),
      delist: getActionChainEvents('delist'),
      buy: getActionChainEvents('buy'),
    };
  }, [chainEvents, actionType, currentEditingChainEvent, editingChainEvent]);

  const collection = search.rules.find((rule) => rule.label === 'collection');

  const actionChainElements = useMemo(() => {
    return [
      { actionName: 'buy' },
      { actionName: 'list' },
      { actionName: 'delist' },
    ].map(({ actionName }) => (
      <ChainAction
        actionName={actionName}
        actionChainEvents={actionChainEvents}
        switchEditingChainEvent={switchEditingChainEvent}
        handleDeleteChainEvent={handleDeleteChainEvent}
        editingChainEvent={editingChainEvent}
        chainEvents={chainEvents}
        actionType={actionType}
        handleAddChainEvent={handleAddChainEvent}
        setActionType={setActionType}
      />
    ));
  }, [actionChainEvents, actionType, chainEvents, editingChainEvent, search]);

  return (
    <>
      {actionChainElements}
      <HuntRule
        rule={currentEditingChainEvent}
        onChange={(...props) => {
          console.log('ACTION TYPE', actionType);
          handleUpdateEditingChainEvent(...props, actionType);
        }}
        collection={collection}
        actionType={actionType}
      />
    </>
  );
};

export default HuntChainActions;
