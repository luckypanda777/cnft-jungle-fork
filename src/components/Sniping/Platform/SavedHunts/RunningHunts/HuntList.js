import { useContext, useEffect, useMemo, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Hunt from './components/Hunt';
import {
  Box,
  Button,
  IconButton,
  Divider,
  CircularProgress,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import { AutoSizer, List } from 'react-virtualized';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CustomTooltip from 'components/common/CustomTooltip';
import Input from 'components/common/Input';
import { Context as SearchContext } from 'context/SearchContext';
import { Context as AuthContext } from 'context/AuthContext';
import EditHuntModal from '../EditHuntModal';
import Huntlists from './components/Huntlists';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import EditIcon from '@mui/icons-material/Edit';
import { useSearch } from 'hooks//useSearch';
import useWindowSize from 'hooks/useWindowSize';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const Huntlist = ({ searches, isHistory }) => {
  const { height } = useWindowSize();
  const { loadingHunts, getHunts } = useSearch();

  useEffect(() => {
    getHunts();
  }, []);

  const {
    stopAllHunts,
    startAllhunts,
    clearEditingHunt,
    selectAllHunts,
    deselectAllHunts,
    setEditingHunt,
    state: { editingHunt, editType, selectedHuntlist, selectedMultiEdit },
  } = useContext(SearchContext);
  const {
    state: { user, allowance },
  } = useContext(AuthContext);
  const [searchWord, setSearchWord] = useState('');
  const [value] = useDebounce(searchWord, 500);

  const searchList = useMemo(() => {
    if (value === ':zing') {
      return searches.filter((search) => search.type === 'zing');
    }

    if (value === ':autobuy') {
      return searches.filter((search) => search.isAutoBuy);
    }

    if (value === ':stopped') {
      return searches.filter((search) => search.isStopped);
    }

    if (value === ':running') {
      return searches.filter((search) => !search.isStopped);
    }

    return value
      ? searches.filter((hunt, index) => {
          const collection = hunt.rules.find(
            (rule) => rule.label === 'collection'
          );

          return (
            (hunt.label?.toLowerCase().includes(value.toLowerCase()) ||
              collection.value.name
                .toLowerCase()
                .includes(value.toLowerCase()) ||
              index == value) &&
            (selectedHuntlist ? selectedHuntlist === hunt.huntlistName : true)
          );
        })
      : selectedHuntlist
      ? searches.filter((hunt) => selectedHuntlist === hunt.huntlistName)
      : searches;
  }, [selectedHuntlist, value, searches]);

  const handleSearchChange = (e) => {
    setSearchWord(e.target.value);
  };

  const rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <div key={key} style={style}>
        <Hunt
          isSelected={selectedMultiEdit.includes(searchList[index]._id)}
          search={searchList[index]}
          isHistory={false}
          index={index}
          showDivider={index !== 0}
        />
      </div>
    );
  };

  const HuntListHeader = ({ title, space, onClick, buttonTitle }) => {
    return (
      <ListItem
        sx={{
          textAlign: 'left',
          pl: 3,
          mt: space && 1,
          position: 'relative',
        }}
      >
        <ListItemText
          sx={{ mycursor: 'default' }}
          primary={title}
          primaryTypographyProps={{
            fontSize: 16,
            fontWeight: 'medium',
            letterSpacing: 0,
            color: 'whitesmoke',
            fontFamily: 'newgilroymedium',
          }}
        />
        {onClick && (
          <Button
            loading={true}
            sx={{
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'newgilroymedium',
              color: 'whitesmoke',
              height: 25,
              mr: 1,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
              },
            }}
            size="small"
            onClick={onClick}
            variant="outlined"
          >
            {buttonTitle}
          </Button>
        )}
      </ListItem>
    );
  };

  if (isHistory) {
    return (
      <Box sx={{ mt: 1, textAlign: 'center' }}>
        <HuntListHeader
          title="Most Recent Hunt"
          // onClick={() => setTab(2)}
          buttonTitle="See Ongoing"
        />
        <Box maxHeight={isHistory ? '65px' : '360px'}>
          <Hunt search={searchList[0]} isHistory={true} />
        </Box>
      </Box>
    );
  }

  const areAllStopped = searches
    .filter((hunt) =>
      selectedHuntlist ? hunt.huntlistName === selectedHuntlist : true
    )
    .every((hunt) => hunt.isStopped);

  const areAllMultiEdit = searches
    .filter((hunt, index) => {
      const collection = hunt.rules.find((rule) => rule.label === 'collection');

      const filter = searchWord.toLowerCase();

      return (
        hunt.label?.toLowerCase().includes(filter) ||
        collection.value.name.toLowerCase().includes(filter) ||
        index == filter
      );
    })
    .filter((hunt) =>
      selectedHuntlist ? hunt.huntlistName === selectedHuntlist : true
    )
    .every((hunt) => selectedMultiEdit.includes(hunt._id));

  const playPauseIcon = areAllStopped ? (
    <PlayArrowIcon fontSize="medium" />
  ) : (
    <StopIcon fontSize="medium" />
  );

  const multiEditIcon = areAllMultiEdit ? (
    <FilterNoneIcon fontSize="small" />
  ) : (
    <DoneAllIcon fontSize="medium" />
  );

  const huntCount = useMemo(() => {
    const total = searches.filter((hunt) =>
      selectedHuntlist ? hunt.huntlistName === selectedHuntlist : true
    ).length;

    const stopped = searches.filter(
      (hunt) =>
        (selectedHuntlist ? hunt.huntlistName === selectedHuntlist : true) &&
        hunt.isStopped
    ).length;

    const running = searches.filter(
      (hunt) =>
        (selectedHuntlist ? hunt.huntlistName === selectedHuntlist : true) &&
        !hunt.isStopped
    ).length;

    const autoBuy = searches.filter(
      (hunt) =>
        (selectedHuntlist ? hunt.huntlistName === selectedHuntlist : true) &&
        hunt.isAutoBuy
    ).length;

    return {
      total,
      running,
      stopped,
      autoBuy,
    };
  }, [searchList]);

  return (
    <WhiteCard
      sx={{
        m: 0,
        p: 0,
        minHeight: height * 0.7,
        height: 'fit-content',
        px: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 3,
          justifyContent: 'space-between',
          columnGap: 2,
        }}
      >
        <Box sx={{ display: 'flex', columnGap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
                Hunt Navigation
              </span>
              <CustomTooltip
                title="Search for a specific hunt by name, policy or index in the list"
                placement="right"
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                my: 2,
                columnGap: 3,
              }}
            >
              <Input
                autoFocus
                label="Search hunt"
                value={searchWord}
                onChange={handleSearchChange}
                placeholder="Search by name, label or index"
                variant="standard"
                sx={{ width: '100%', minWidth: 250, maxWidth: 250 }}
              />
            </Box>
          </Box>
          <Huntlists />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            width: 300,
            rowGap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontFamily: 'newgilroymedium', fontSize: 18 }}>
              Hunt Controls
            </span>
            <CustomTooltip
              title="Control all hunts in the list. Multi-edit, start, stop, delete."
              placement="right"
            />
          </Box>
          <Box sx={{ display: 'flex', columnGap: 2 }}>
            <Box sx={{ display: 'flex' }}>
              Total: {huntCount.total}/
              {user.snipeTier === 'orca' ? '∞' : allowance.huntAmount}
            </Box>
            <Box sx={{ display: 'flex' }}>
              Auto Buy: {huntCount.autoBuy}/{allowance.autoBuyHuntAmount}
            </Box>
            <Box sx={{ display: 'flex' }}>
              Running: {huntCount.running}/{huntCount.total}
            </Box>
            {selectedMultiEdit.length > 0 && (
              <Box>Selected: {selectedMultiEdit.length}</Box>
            )}
          </Box>
          <Box sx={{ display: 'flex' }}>
            <CustomTooltip placement="bottom" title="Refresh the hunt list">
              <IconButton
                sx={{
                  mt: -2,
                  color: 'var(--fontColor)',
                  '&:hover': {
                    color: 'var(--fontColor)',
                    opacity: 0.9,
                  },
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
                onClick={() => getHunts()}
              >
                <RestartAltIcon />
              </IconButton>
            </CustomTooltip>
            <CustomTooltip
              title={areAllStopped ? 'Start All Hunts' : 'Stop All Hunts'}
            >
              <IconButton
                aria-label="stop"
                onClick={areAllStopped ? startAllhunts : stopAllHunts}
                sx={{
                  mt: -2,
                  color: areAllStopped
                    ? 'var(--undervaluedColor)'
                    : 'var(--tertiaryColor)',
                  '&:hover': {
                    color: areAllStopped
                      ? 'var(--undervaluedColor)'
                      : 'var(--tertiaryColor)',
                    opacity: 0.9,
                  },
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              >
                {playPauseIcon}
              </IconButton>
            </CustomTooltip>
            {selectedMultiEdit.length > 0 && (
              <CustomTooltip title="Edit Selected">
                <IconButton
                  aria-label="edit"
                  onClick={() =>
                    setEditingHunt({ hunt: { rules: [] }, editType: 'all' })
                  }
                  sx={{
                    mt: -2,
                    color: 'var(--fontColor)',
                    '&:hover': { opacity: 0.9 },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </CustomTooltip>
            )}
            <CustomTooltip
              title={areAllMultiEdit ? 'Deselect All' : 'Select All'}
            >
              <IconButton
                aria-label="stop"
                onClick={
                  areAllMultiEdit
                    ? deselectAllHunts
                    : () => selectAllHunts(searchWord)
                }
                sx={{
                  mt: -2,
                  color: 'var(--fontColor)',
                  '&:hover': { opacity: 0.9 },
                }}
              >
                {multiEditIcon}
              </IconButton>
            </CustomTooltip>
          </Box>
        </Box>
      </Box>
      <Divider
        sx={{
          width: '100%',
          mx: 'auto',
          my: 3,
          backgroundColor: 'var(--rankGrey)',
        }}
      />
      {loadingHunts ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress sx={{ fontSize: 26, mt: 0 }} />
        </Box>
      ) : searchList.length === 0 ? (
        <Box sx={{ pl: 3 }}>
          <span>No hunts found.</span>
        </Box>
      ) : (
        <AutoSizer>
          {({ width }) => (
            <List
              height={height * 0.5}
              rowCount={searchList.length}
              rowHeight={250}
              rowRenderer={rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      )}
      <EditHuntModal
        open={!!editingHunt}
        editingHunt={editingHunt}
        editType={editType}
        clearEditingHunt={clearEditingHunt}
        selectedMultiEdit={selectedMultiEdit}
      />
    </WhiteCard>
  );
};

export default Huntlist;
