import React, { useContext } from 'react';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as AuthContext } from 'context/AuthContext';
import { Box, IconButton, Tooltip } from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CustomTooltip from 'components/common/CustomTooltip';
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import FlashOffIcon from '@mui/icons-material/FlashOff';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import HuntlistBadge from './HuntlistBadge';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HuntPreview from './HuntPreview';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffCsredIcon from '@mui/icons-material/MoneyOffCsred';

const HuntControls = ({ search, isHistory }) => {
  const {
    state: { user, allowance },
  } = useContext(AuthContext);
  const { showFeedback } = useContext(FeedbackContext);
  const {
    removeSearch,
    updateSearch,
    setEditingHunt,
    setSelectedMultiEdit,
    state: { selectedMultiEdit, huntList },
  } = useContext(SearchContext);
  const { isStopped, isQuickSnipe, isAutoBuy } = search;

  const isInMultiEdit = selectedMultiEdit.includes(search._id);

  const playPause = () => {
    if (isStopped) {
      updateSearch(search, 'resume');
      showFeedback({
        kind: 'success',
        message: 'Hunt resumed!',
      });
    } else {
      updateSearch(search, 'stop');
      showFeedback({
        kind: 'success',
        message: 'Hunt stopped!',
      });
    }
  };

  const multiEdit = () => {
    if (isInMultiEdit) {
      setSelectedMultiEdit(selectedMultiEdit.filter((id) => id !== search._id));
    } else {
      setSelectedMultiEdit([...selectedMultiEdit, search._id]);
    }
  };

  const deleteSearch = () => {
    removeSearch(search);
  };

  const duplicateSearch = () => {
    setEditingHunt({ hunt: search, editType: 'duplicate' });
  };

  const editSearch = () => {
    setEditingHunt({ hunt: search, editType: 'edit' });
  };

  const toggleQuickSnipe = () => {
    updateSearch({ ...search, isQuickSnipe: !isQuickSnipe }, 'edit');
    showFeedback({
      kind: 'success',
      message: 'Hunt updated!',
    });
  };

  const toggleAutoBuy = () => {
    console.log(allowance);
    if (
      !isAutoBuy &&
      huntList.filter((h) => h.isAutoBuy).length === allowance.autoBuyHuntAmount
    ) {
      return showFeedback({
        message: `You can only have ${allowance.autoBuyHuntAmount} auto buy snipes.`,
        kind: 'error',
      });
    }

    updateSearch({ ...search, isAutoBuy: !isAutoBuy }, 'edit');
    showFeedback({
      kind: 'success',
      message: 'Hunt updated!',
    });
  };

  const playPauseIcon = isStopped ? (
    <PlayArrowIcon fontSize="medium" />
  ) : (
    <StopIcon fontSize="medium" />
  );

  const multiEditIcon = isInMultiEdit ? (
    <CheckBoxIcon fontSize="small" />
  ) : (
    <CheckBoxOutlineBlankIcon fontSize="small" />
  );

  return (
    !isHistory && (
      <Box sx={{ display: 'flex', columnGap: 1 }}>
        <HuntPreview search={search} />
        <CustomTooltip title={isStopped ? 'Resume Hunt' : 'Pause Hunt'}>
          <IconButton
            aria-label="multiedit"
            onClick={playPause}
            sx={{
              color: isStopped
                ? 'var(--undervaluedColor)'
                : 'var(--errorColor)',
              '&:hover': {
                color: isStopped
                  ? 'var(--undervaluedColor)'
                  : 'var(--errorColor)',
                opacity: 0.9,
              },
            }}
          >
            {playPauseIcon}
          </IconButton>
        </CustomTooltip>
        <CustomTooltip
          title={isAutoBuy ? 'Disable Auto Buy' : 'Enable Auto Buy'}
        >
          <IconButton
            aria-label="autobuy"
            onClick={toggleAutoBuy}
            sx={{
              color: 'var(--fontColor)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            {isAutoBuy ? (
              <MoneyOffCsredIcon fontSize="medium" color="primary" />
            ) : (
              <AttachMoneyIcon fontSize="medium" />
            )}
          </IconButton>
        </CustomTooltip>
        <CustomTooltip
          title={isQuickSnipe ? 'Disable Quick Snipe' : 'Enable Quick Snipe'}
        >
          <IconButton
            aria-label="quicksnipe"
            onClick={toggleQuickSnipe}
            sx={{
              color: 'var(--fontColor)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            {isQuickSnipe ? (
              <FlashOnIcon fontSize="medium" />
            ) : (
              <FlashOffIcon fontSize="medium" />
            )}
          </IconButton>
        </CustomTooltip>
        <HuntlistBadge hunt={search} />
        <CustomTooltip title="Delete Hunt">
          <IconButton
            aria-label="delete"
            onClick={deleteSearch}
            sx={{
              color: 'var(--fontColor)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <DoDisturbIcon fontSize="small" />
          </IconButton>
        </CustomTooltip>
        <CustomTooltip
          title={isInMultiEdit ? 'Remove Selection' : 'Add Selection'}
        >
          <IconButton
            aria-label="multiedit"
            onClick={multiEdit}
            sx={{
              color: 'var(--fontColor)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            {multiEditIcon}
          </IconButton>
        </CustomTooltip>
        <CustomTooltip title="Duplicate Hunt">
          <IconButton
            aria-label="duplicate"
            onClick={duplicateSearch}
            sx={{
              color: 'var(--fontColor)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <ControlPointDuplicateIcon fontSize="small" />
          </IconButton>
        </CustomTooltip>
        <CustomTooltip title="Edit Hunt">
          <IconButton
            aria-label="edit"
            onClick={editSearch}
            sx={{
              color: 'var(--fontColor)',
              '&:hover': { opacity: 0.9 },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </CustomTooltip>
      </Box>
    )
  );
};

export default HuntControls;
