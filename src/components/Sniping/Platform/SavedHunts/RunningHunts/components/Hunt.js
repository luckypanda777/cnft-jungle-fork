import React from 'react';
import HuntControls from './HuntControls';
import { Box, Divider } from '@mui/material';
import HuntSummary from './HuntSummary';
import { middlen } from 'utils/shorten';
import moment from 'moment';
import octopus from 'assets/octopus.png';
import junglewhale from 'assets/junglewhale.png';
import CustomTooltip from 'components/common/CustomTooltip';
import BowIcon from 'assets/bow.svg';

const Hunt = ({ search, isHistory, index, showDivider, isSelected }) => {
  const collection = search.rules.find((rule) => rule.label === 'collection');

  return (
    <Box
      sx={{
        maxHeight: 'fit-content',
        height: 225,
        overflowY: 'auto',
        overflowX: 'hidden',
        mr: 1,
        backgroundColor: isSelected ? 'var(--lightGrey)' : 'transparent',
        borderLeft: search.isAutoBuy
          ? '3px solid var(--goldenCard)'
          : isSelected
          ? '3px solid var(--logoColor)'
          : 'none',
        pl: isSelected || search.isAutoBuy ? 1 : 0,
      }}
    >
      {showDivider && (
        <Divider
          sx={{
            height: '1px',
            width: '100%',
            mx: 'auto',
            borderColor: 'var(--logoColor)',
            mb: 2,
          }}
        />
      )}
      <Box
        sx={{
          mb: 0,
          fontSize: 20,
          display: 'flex',
          alignItems: 'center',
          columnGap: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: 'fit-content',
            alignItems: 'center',
          }}
        >
          {!isHistory && (
            <span style={{ fontSize: 20, color: 'var(--logoColor)' }}>
              {' '}
              #{index + 1}{' '}
            </span>
          )}
          <Divider
            orientation="vertical"
            sx={{
              height: 15,
              my: 'auto',
              backgroundColor: 'var(--fontColor)',
              mx: 1,
            }}
          />
          <span>{middlen(!search.label ? search.name : search.label, 20)}</span>

          {search.type === 'bundle' && (
            <CustomTooltip
              placement="right"
              title="Bundle Alert"
              style={{ paddingTop: 0, marginLeft: 0 }}
            >
              <img
                src={junglewhale.src}
                width={35}
                style={{ marginLeft: 10 }}
              />
            </CustomTooltip>
          )}
          {search.type === 'zing' && (
            <CustomTooltip
              placement="right"
              title="Zing Alert"
              style={{ paddingTop: 0, marginLeft: 0 }}
            >
              <img src={octopus.src} width={22} style={{ marginLeft: 10 }} />
            </CustomTooltip>
          )}
          {search.type === 'hunt' && (
            <CustomTooltip
              placement="right"
              title="Hunt Alert"
              style={{ paddingTop: 0, marginLeft: 0 }}
            >
              <BowIcon width={20} style={{ marginLeft: 10 }} />
            </CustomTooltip>
          )}
        </Box>
        <HuntControls search={search} isHistory={isHistory} />
      </Box>
      <HuntSummary search={search} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          mt: 3,
          fontFamily: 'newgilroymedium',
          fontSize: 14,
        }}
      >
        {search.huntlistName && <span>Hunt Folder: {search.huntlistName}</span>}
        <span>Started {moment(search.createdAt).fromNow()}</span>
        {search.updatedAt && (
          <span>Updated {moment(search.updatedAt).fromNow()}</span>
        )}
      </Box>
    </Box>
  );
};

export default Hunt;
