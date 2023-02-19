import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, capitalize, Divider, IconButton } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import RulesPopover from './RulesPopover';
import HuntRule from './HuntRule';
import Input from 'components/common/Input';
import { createHunt, updateAllHunts, updateHunt } from 'apiProvider';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as AuthContext } from 'context/AuthContext';
import ClearIcon from '@mui/icons-material/Clear';
import Select from 'components/common/Select';
import HuntPreview from 'components/Sniping/Platform/SavedHunts/RunningHunts/components/HuntPreview';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import CustomTooltip from 'components/common/CustomTooltip';
import HuntAlert from './HuntTypes/HuntAlert';
import ZingAlert from './HuntTypes/ZingAlert';
import { useRouter } from 'next/router';
import InstinctAlert from './HuntTypes/InstinctAlert';

const NFTHunt = () => {
  const router = useRouter();
  const {
    state: { editingHunt, editType, huntList, selectedMultiEdit },
    clearEditingHunt,
    setSelectedMultiEdit,
    setSearches,
  } = useContext(SearchContext);
  const {
    state: { user, allowance },
  } = useContext(AuthContext);
  const { showFeedback } = useContext(FeedbackContext);
  const [huntType, setHuntType] = useState('hunt');
  const [huntLabel, setHuntLabel] = useState('');
  const [huntlistName, setHuntlistName] = useState(user?.huntlistNames?.[0]);
  const [editingRule, setEditingRule] = useState('collection');
  const [editingChainEvent, setEditingChainEvent] = useState({
    label: '',
    actionType: '',
  });
  const [selectedRules, setSelectedRules] = useState([]);
  const [chainEvents, setChainEvents] = useState([]);
  const [openedPopover, setOpenedPopover] = useState(false);

  const collection = selectedRules.find((rule) => rule.label === 'collection');

  const handlePopoverOpen = () => {
    setOpenedPopover(true);
  };

  const handlePopoverClose = () => {
    setOpenedPopover(false);
  };

  const handleSwitchEditingRule = (label) => {
    setEditingRule(label);
    setOpenedPopover(false);
  };

  const handleSwitchEditingChainEvent = ({ label, actionType }) => {
    setEditingChainEvent({ label, actionType });
    setOpenedPopover(false);
  };

  const handleUpdateEditingRule = (label, value, action) => {
    if (label === 'traits') {
      //  keep previous traits if new one is added
      const previousTraits = selectedRules.find(
        (rule) => rule.label === 'traits'
      )?.value;

      if (previousTraits && action !== 'delete') {
        // remove duplicates
        value = [...previousTraits, ...value].filter(
          (v, i, a) => a.indexOf(v) === i
        );
      }
    }

    setSelectedRules((prev) =>
      prev.map((rule) => {
        if (label === rule.label) {
          return {
            ...rule,
            value,
          };
        }

        return rule;
      })
    );
  };

  const handleUpdateEditingChainEvent = (label, value, actionType) => {
    setChainEvents((prev) =>
      prev.map((rule) => {
        console.log(
          'UPDATE',
          rule,
          label,
          value,
          actionType,
          label === rule.label && actionType === rule.actionType
        );
        if (label === rule.label && actionType === rule.actionType) {
          return {
            ...rule,
            value,
          };
        }

        return rule;
      })
    );
  };

  const handleCreateRule = (rule) => {
    setOpenedPopover(false);
    setEditingRule(rule.label);
    setSelectedRules((prev) => [
      {
        ...rule,
        key: rule.label,
        value: null,
      },
      ...prev,
    ]);
  };

  const handleCreateHunt = async () => {
    if (!collection.value?.name) {
      return showFeedback({
        message: 'Please choose a collection',
        kind: 'error',
      });
    }

    if (huntList.length + 1 > allowance.huntAmount) {
      return showFeedback({
        message: `You can only have ${allowance.huntAmount} hunts.`,
        kind: 'error',
      });
    }

    const hunt = {
      rules: selectedRules.filter((rule) => rule.value !== null),
      label: huntLabel || collection.value.name,
      huntlistName,
      type: huntType,
    };

    return await createHunt(hunt)
      .then(({ huntList: newHuntList }) => {
        console.log('Hunt created');
        showFeedback({
          message: 'Hunt created!',
          kind: 'success',
          duration: 2000,
        });
        setSearches(newHuntList);
      })
      .catch((err) => {
        console.log(err);
        showFeedback({
          message: 'Hunt create error!',
          kind: 'error',
          duration: 2000,
        });
      });
  };

  const handleDeleteRule = (label) => {
    if (label === 'collection' || selectedRules.length === 1) return;

    setSelectedRules((prev) => prev.filter((rule) => rule.label !== label));
    setEditingRule(selectedRules[1].label);
  };

  const handleDeleteChainEvent = (label, actionType) => {
    setChainEvents((prev) =>
      prev.filter(
        (rule) => !(rule.label === label && rule.actionType === actionType)
      )
    );
    setEditingChainEvent({
      label: chainEvents[0]?.label || '',
      actionType: chainEvents[0]?.actionType || '',
    });
  };

  const handleUpdateHunt = async () => {
    const collection = selectedRules.find(
      (rule) => rule.label === 'collection'
    );

    if (!collection.value?.name) {
      return showFeedback({
        message: 'Please choose a collection',
        kind: 'error',
      });
    }

    const hunt = {
      ...editingHunt,
      isStopped: false,
      rules: selectedRules,
      label: huntLabel,
      huntlistName,
      type: huntType,
    };

    return await updateHunt(editingHunt._id, hunt)
      .then(() => {
        console.log('Hunt updated');
        showFeedback({
          message: 'Hunt updated!',
          kind: 'success',
          duration: 2000,
        });
        clearEditingHunt();

        setSearches(
          huntList.map((h) => (h._id === editingHunt._id ? hunt : h))
        );
      })
      .catch((err) => {
        console.log(err);
        showFeedback({
          message: 'Hunt update error!',
          kind: 'error',
          duration: 2000,
        });
      });
  };

  const handleMultipleUpdate = async () => {
    return await updateAllHunts({
      type: 'all',
      payload: {
        rules: selectedRules,
        huntlistName,
        ids: selectedMultiEdit,
      },
    })
      .then(({ huntList }) => {
        console.log('Hunts updated');
        showFeedback({
          message: 'Hunts updated!',
          kind: 'success',
          duration: 2000,
        });
        setSelectedMultiEdit([]);
        setSearches(huntList);
        clearEditingHunt();
      })
      .catch((err) => {
        console.log(err);
        showFeedback({
          message: 'Hunts update error!',
          kind: 'error',
          duration: 2000,
        });
      });
  };

  const handleAddChainEvent = (chainEvent) => {
    console.log(chainEvent);
    setOpenedPopover(false);
    setEditingChainEvent({
      label: chainEvent.label,
      actionType: chainEvent.actionType,
    });
    setChainEvents((prev) => [
      ...prev,
      {
        ...chainEvent,
        key: chainEvent.label,
        value: null,
      },
    ]);
  };

  const handleAddChainLogic = (chainEvent) => {
    setOpenedPopover(false);
    setEditingChainEvent({
      label: chainEvent.label,
      actionType: chainEvent.actionType,
    });
    setChainEvents((prev) => [
      ...prev,
      {
        ...chainEvent,
        key: chainEvent.label,
        value: null,
      },
    ]);
  };

  useEffect(() => {
    if (editingHunt) {
      setHuntLabel(editingHunt.label);
      setSelectedRules(editingHunt.rules);
      setHuntlistName(editingHunt.huntlistName);
      setHuntType(editingHunt.type);
    }

    if (selectedMultiEdit.length > 0) {
      const multiEditHunts = huntList.filter((h) =>
        selectedMultiEdit.includes(h._id)
      );

      const multiEditCollection = multiEditHunts[0]?.rules.find(
        (r) => r.label === 'collection'
      );

      if (
        multiEditHunts.every(
          (h) =>
            h.rules?.find((r) => r.label === 'collection')?.value?.name ===
            multiEditCollection?.value?.name
        )
      ) {
        setSelectedRules([multiEditCollection]);
      }
    }

    if (
      huntList
        .filter((h) => selectedMultiEdit.includes(h._id))
        .every((hunt) => hunt.huntlistName === huntList[0].huntlistName)
    ) {
      selectedMultiEdit.every;
    }
  }, [editingHunt, selectedMultiEdit]);

  useEffect(() => {
    if (editingHunt) return;

    if (huntType === 'hunt' || huntType === 'bundle') {
      setSelectedRules([
        {
          label: 'collection',
          name: 'Collection',
        },
      ]);
    } else {
      // [NOTE] not available yet
      // setSelectedRules([
      //   {
      //     label: 'collection',
      //     name: 'Any',
      //     value: {
      //       name: 'All Collections',
      //       policies: 'All Collections',
      //     },
      //   },
      // ]);
    }
  }, [huntType]);

  useEffect(() => {
    const { name, policyId, collectionId } = router.query;

    if (name && policyId) {
      setSelectedRules([
        {
          label: 'collection',
          name: 'Collection',
          value: {
            name,
            policies: policyId,
            id: collectionId,
          },
        },
      ]);
    }
  }, [router.query]);

  const currentEditingRule = useMemo(
    () => selectedRules.find((rule) => rule.label === editingRule),
    [editingRule, selectedRules]
  );

  const currentEditingChainEvent = useMemo(() => {
    console.log(chainEvents, editingChainEvent);
    return (
      chainEvents.find(
        (rule) =>
          rule.label === editingChainEvent.label &&
          rule.actionType === editingChainEvent.actionType
      ) || {}
    );
  }, [editingChainEvent, chainEvents]);

  const huntTypes = useMemo(() => {
    if (huntType === 'hunt' || huntType === 'bundle') {
      return (
        <HuntAlert
          handlePopoverOpen={handlePopoverOpen}
          handlePopoverClose={handlePopoverClose}
          handleSwitchEditingRule={handleSwitchEditingRule}
          handleUpdateEditingRule={handleUpdateEditingRule}
          handleCreateRule={handleCreateRule}
          handleDeleteRule={handleDeleteRule}
          currentEditingRule={currentEditingRule}
          editingRule={editingRule}
          huntType={huntType}
          huntLabel={huntLabel}
          huntlistName={huntlistName}
          selectedRules={selectedRules}
          openedPopover={openedPopover}
          setHuntType={setHuntType}
          setHuntLabel={setHuntLabel}
          setHuntlistName={setHuntlistName}
          setEditingRule={setEditingRule}
          setSelectedRules={setSelectedRules}
          setOpenedPopover={setOpenedPopover}
        />
      );
    }

    if (huntType === 'zing') {
      return (
        <ZingAlert
          handlePopoverOpen={handlePopoverOpen}
          handlePopoverClose={handlePopoverClose}
          handleSwitchEditingRule={handleSwitchEditingRule}
          handleUpdateEditingRule={handleUpdateEditingRule}
          handleCreateRule={handleCreateRule}
          handleDeleteRule={handleDeleteRule}
          currentEditingRule={currentEditingRule}
          editingRule={editingRule}
          huntType={huntType}
          huntLabel={huntLabel}
          huntlistName={huntlistName}
          selectedRules={selectedRules}
          openedPopover={openedPopover}
          setHuntType={setHuntType}
          setHuntLabel={setHuntLabel}
          setHuntlistName={setHuntlistName}
          setEditingRule={setEditingRule}
          setSelectedRules={setSelectedRules}
          setOpenedPopover={setOpenedPopover}
        />
      );
    }

    if (huntType === 'instinct') {
      return (
        <InstinctAlert
          handlePopoverOpen={handlePopoverOpen}
          handlePopoverClose={handlePopoverClose}
          handleSwitchEditingRule={handleSwitchEditingRule}
          handleUpdateEditingRule={handleUpdateEditingRule}
          handleCreateRule={handleCreateRule}
          handleDeleteRule={handleDeleteRule}
          currentEditingRule={currentEditingRule}
          editingRule={editingRule}
          huntType={huntType}
          huntLabel={huntLabel}
          huntlistName={huntlistName}
          selectedRules={selectedRules}
          openedPopover={openedPopover}
          setHuntType={setHuntType}
          setHuntLabel={setHuntLabel}
          setHuntlistName={setHuntlistName}
          setEditingRule={setEditingRule}
          setSelectedRules={setSelectedRules}
          setOpenedPopover={setOpenedPopover}
          handleAddChainEvent={handleAddChainEvent}
          handleAddChainLogic={handleAddChainLogic}
          handleDeleteChainEvent={handleDeleteChainEvent}
          handleSwitchEditingChainEvent={handleSwitchEditingChainEvent}
          chainEvents={chainEvents}
          currentEditingChainEvent={currentEditingChainEvent}
          handleUpdateEditingChainEvent={handleUpdateEditingChainEvent}
          editingChainEvent={editingChainEvent}
        />
      );
    }
  }, [
    huntType,
    huntLabel,
    huntlistName,
    editingRule,
    selectedRules,
    openedPopover,
    chainEvents,
    editingChainEvent,
    currentEditingChainEvent,
  ]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        maxWidth: editingHunt ? 'fit-content' : 1400,
        pl: editingHunt ? 0 : 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          width: '100%',
          rowGap: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            rowGap: 4,
            mt: editingRule ? 0 : 3,
            py: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              rowGap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
                Select Hunt Type
              </span>
              <CustomTooltip
                title="Select hunt type; Hunt - opens the snipe window/auto-buy. Zing - notifies about market movements."
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
                { name: 'hunt', disabled: false },
                { name: 'zing', disabled: false },
                { name: 'bundle', disabled: false },
                { name: 'instinct', disabled: true },
                { name: 'loan', disabled: true },
              ].map(({ name, disabled }) => {
                return (
                  <FilterButton
                    // add small shadow
                    sx={{
                      fontSize: 12,
                      border: 'none',
                      backgroundColor: disabled
                        ? 'var(--grey)'
                        : name === huntType
                        ? 'var(--primaryColor)'
                        : 'var(--lightGrey)',
                      color: disabled ? 'var(--lightGrey)' : 'white',
                      '&:hover': {
                        backgroundColor: disabled
                          ? 'var(--grey)'
                          : 'var(--logoColor)',
                        color: disabled ? 'var(--lightGrey)' : 'white',
                        opacity: 0.9,
                      },
                    }}
                    onClick={() => {
                      if (disabled) return;

                      setHuntType(name);
                    }}
                    pressable
                    name={name}
                    tooltip={disabled ? 'Coming soon..' : ''}
                  >
                    {capitalize(name)}
                  </FilterButton>
                );
              })}
            </Box>
          </Box>
          {huntTypes}
          <Box
            sx={{ display: 'flex', columnGap: 1, justifyContent: 'flex-start' }}
          >
            <WalletButtonBase
              sx={{
                p: '10px 15px',
                borderRadius: 2,
                cursor: 'pointer',
                color: 'white',
                backgroundColor: 'var(--logoColor)',
                width: 300,
                '&:hover': {
                  backgroundColor: 'var(--logoColor)',
                  color: 'white',
                  opacity: 0.9,
                },
              }}
              onClick={
                editType === 'edit'
                  ? handleUpdateHunt
                  : editType === 'all'
                  ? handleMultipleUpdate
                  : handleCreateHunt
              }
            >
              {editType === 'edit'
                ? 'Save Changes'
                : editType === 'all'
                ? 'Edit Hunts'
                : `Start ${capitalize(huntType)}`}
            </WalletButtonBase>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NFTHunt;
