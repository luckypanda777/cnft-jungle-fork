import useDetectDevice from 'hooks/useDetectDevice';
import { Box, useTheme } from '@mui/system';
import React from 'react';
import styles from './TextHeader.module.scss';
import useWindowSize from 'hooks/useWindowSize';
import CustomTooltip from '../CustomTooltip';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';

// [TODO]
// Possible font combo: Antic,Anonymous Pro, Sanchez

const TextHeader = ({
  title,
  subtitle,
  helpText,
  center,
  actionButtons = [],
  noTopMargin = false,
  children,
}) => {
  const theme = useTheme();
  const { isMobile } = useDetectDevice();
  const { width } = useWindowSize();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minWidth: isMobile || center ? 'initial' : '585px',
        alignItems: isMobile || center ? 'center' : 'flex-start',
        textAlign: isMobile || center ? 'center' : 'left',
        width: center ? '100%' : 'auto',
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: isMobile ? 26 : 44,
          marginBottom: 0,
          fontFamily: 'newgilroysemibold',
          marginTop: noTopMargin ? 0 : 46,
          zIndex: 5,
        }}
        className={styles.title}
      >
        {title}
      </h1>
      <h2
        style={{
          fontSize: isMobile ? 16 : 24,
          marginTop: 10,
          marginBottom: 10,
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          fontFamily: 'newgilroysemibold',
        }}
      >
        {subtitle}
        {!isMobile && helpText && <CustomTooltip title={helpText} />}
      </h2>
      {actionButtons.length > 0 && (
        <Box sx={{ display: 'flex', columnGap: 2 }}>
          {actionButtons.map((button) => (
            <WalletButtonBase
              onClick={button.onClick}
              sx={{ height: 45, color: 'var(--whiteColor)', ...button.sx }}
            >
              {button.title}
            </WalletButtonBase>
          ))}
        </Box>
      )}
      {children && children}
      {/* {socialText && !(isMobile && hideSocialOnMobile) && (
        <Box sx={{ wordBreak: 'break-word', color: 'var(--rankGrey)' }}>
          <span
            style={{
              marginTop: 0,
              display: 'flex',
              alignItems: 'center',
              fontFamily: "newgilroymedium",
            }}
          >
            {socialText}
            <Box sx={{ display: 'flex' }}>
              <IconButton
                onClick={() => window.open('https://discord.gg/T9Ktk9j5vN')}
                sx={{ mr: 0 }}
              >
                <Icon
                  icon={'simple-icons:discord'}
                  style={{
                    fontSize: 20,
                    color:
                      theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.54)'
                        : '#fff',
                  }}
                />
              </IconButton>
              <IconButton
                onClick={() =>
                  window.open('https://www.twitter.com/CNFTJungle')
                }
                sx={{ ml: 0 }}
              >
                <Icon
                  icon={'akar-icons:twitter-fill'}
                  style={{
                    fontSize: 20,
                    color:
                      theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.54)'
                        : '#fff',
                  }}
                />
              </IconButton>
            </Box>
          </span>
        </Box>
      )} */}
    </Box>
  );
};

export default TextHeader;
