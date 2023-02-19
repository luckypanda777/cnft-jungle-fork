import { useContext, useState } from 'react';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as AuthContext } from 'context/AuthContext';
import AddSingleValueModal from 'components/modals/AddSingleValueModal';
import { Box, CircularProgress, IconButton } from '@mui/material';
import FilterButton from 'components/buttons/FilterButton';
import Input from 'components/common/Input';
import {
  manageHuntlist,
  manageRenameHuntlist,
  manageRemoveHuntlist,
} from 'apiProvider';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import CustomTooltip from 'components/common/CustomTooltip';

const Huntlists = () => {
  const { showFeedback } = useContext(FeedbackContext);
  const [huntlistLoading, setHuntlistLoading] = useState(false);
  const [valueModalType, setValueModalType] = useState('');
  const [name, setName] = useState('');

  const {
    setSelectedHuntlist,
    state: { selectedHuntlist },
  } = useContext(SearchContext);
  const {
    state: { user },
    setAuth,
  } = useContext(AuthContext);

  const handleHuntlistOpen = () => {
    setValueModalType('huntlist');
  };

  const handleHuntlistSelect = (name) => {
    setSelectedHuntlist(name);
  };

  const handleHuntlistCreate = async (name) => {
    if (user.huntlistNames.length > 9) {
      return showFeedback({
        message: 'Can only have up to 10 huntlists!',
        kind: 'error',
      });
    }

    if (user.huntlistNames.includes(name)) {
      return showFeedback({
        message: 'Huntlist already exists!',
        kind: 'error',
      });
    }

    setHuntlistLoading(true);
    setSelectedHuntlist(name);
    if (user.huntlistNames.includes(name)) {
      showFeedback({
        message: 'Huntlist name already exists!',
        kind: 'error',
      });
      setHuntlistLoading(false);
      return;
    }
    try {
      await manageHuntlist({ huntlistName: name.toString() }).then(
        ({ user }) => {
          setAuth({ user });
        }
      );
      showFeedback({
        message: 'Huntlist created successfully',
        kind: 'success',
      });
    } catch (err) {
      console.log(err);
      showFeedback({ message: 'Huntlist creation error', kind: 'error' });
    } finally {
      setHuntlistLoading(false);
      setValueModalType('');
    }
  };

  const handleHuntlistRename = async () => {
    if (user.huntlistNames.includes(name)) {
      return showFeedback({
        message: 'Huntlist already exists!',
        kind: 'error',
      });
    }

    try {
      await manageRenameHuntlist({
        oldHuntlistName: selectedHuntlist,
        newHuntlistName: name,
      }).then(({ user }) => {
        setAuth({ user });
      });
      showFeedback({
        message: 'Huntlist renamed successfully',
        kind: 'success',
      });
    } catch (err) {
      console.log(err);
      showFeedback({ message: 'Huntlist removing error', kind: 'error' });
    } finally {
      setHuntlistLoading(false);
      setValueModalType('');
      setSelectedHuntlist(name);
      setName('');
    }
  };

  const handleHuntlistRemove = async () => {
    try {
      await manageRemoveHuntlist({
        huntlistName: selectedHuntlist,
      }).then(({ user }) => {
        setAuth({ user });
      });

      showFeedback({
        message: 'Huntlist removed successfully',
        kind: 'success',
      });
    } catch (err) {
      console.log(err);
      showFeedback({ message: 'Huntlist renaming error', kind: 'error' });
    } finally {
      setHuntlistLoading(false);
      setValueModalType('');
      setSelectedHuntlist(name);
      setName('');
    }
  };

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', columnGap: 3 }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
              Hunt Folders
            </span>
            <CustomTooltip
              title="Select a new folder to view the hunts inside or create a new folder to save hunts to."
              placement="right"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              my: 2,
              pt: 0.25,
              columnGap: 1,
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              gap: 1,
              maxWidth: 600,
            }}
          >
            {['All', ...(user?.huntlistNames || [])].map((name) => {
              return (
                <FilterButton
                  // add small shadow
                  sx={{
                    fontSize: 12,
                    border: 'none',
                    backgroundColor:
                      selectedHuntlist === (name === 'All' ? '' : name)
                        ? 'var(--logoColor)'
                        : 'var(--lightGrey)',
                    color:
                      selectedHuntlist === (name === 'All' ? '' : name)
                        ? 'white'
                        : 'var(--fontColor)',
                    '&:hover': {
                      backgroundColor: 'var(--logoColor)',
                      color: 'white',
                      opacity: 0.9,
                    },
                  }}
                  value={selectedHuntlist === (name === 'All' ? '' : name)}
                  onClick={() =>
                    handleHuntlistSelect(name === 'All' ? '' : name)
                  }
                  pressable
                  name={name}
                >
                  {name}
                </FilterButton>
              );
            })}
            {huntlistLoading ? (
              <CircularProgress size={18} sx={{ p: 0.75 }} />
            ) : (
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
                  },
                }}
                onClick={handleHuntlistOpen}
                pressable
              >
                + Add Hunt Folder
              </FilterButton>
            )}
          </Box>
        </Box>
        <Box>
          {selectedHuntlist && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: 1,
                }}
              >
                <span style={{ fontSize: 18 }}>Rename Folder</span>
                <CustomTooltip title="Delete Folder" placement="top">
                  <IconButton
                    aria-label="delete"
                    onClick={handleHuntlistRemove}
                    sx={{
                      color: 'var(--fontColor)',
                      '&:hover': { opacity: 0.9 },
                      p: 0,
                      mt: -0.5,
                    }}
                  >
                    <DoDisturbIcon fontSize="small" />
                  </IconButton>
                </CustomTooltip>
              </Box>
              <Box sx={{ display: 'flex', columnGap: 1, mt: 2 }}>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{ width: 125 }}
                  placeholder={selectedHuntlist}
                />
                <WalletButtonBase
                  sx={{
                    p: 0,
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    color: 'white',
                    width: 80,
                    minWidth: 'auto',
                    fontFamily: 'newgilroysemibold',
                    border: '2px solid var(--logoColor)',
                    backgroundColor: '#29292B',
                    color: 'var(--fontColor)',
                    '&:disabled': {
                      border: '2px solid #29292B',
                    },
                    '&:hover': {
                      backgroundColor: 'var(--logoColor)',
                      color: 'var(--fontColor)',
                    },
                  }}
                  onClick={handleHuntlistRename}
                >
                  Save
                </WalletButtonBase>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <AddSingleValueModal
        type={valueModalType}
        setValueModalType={setValueModalType}
        onSubmit={handleHuntlistCreate}
        outsideLoading={huntlistLoading}
      />
    </>
  );
};

export default Huntlists;
