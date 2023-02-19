import { IconButton, useTheme, Box } from '@mui/material';
import { Icon } from '@iconify/react';
import cardanoscan from 'assets/cardanoscan.png';
import { eventTrack } from 'config/analytics';
import formatPolicyId from 'utils/formatPolicyId';
import styles from './styles.module.scss';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import BookmarkedBadge from 'components/badges/BookmarkedBadge';
import { useAppContext } from 'context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';

export async function copy(text) {
  if ('clipboard' in window.navigator) {
    return await window.navigator.clipboard.writeText(text);
  } else {
    return document.execCommand('copy', true, text);
  }
}

export const CopiedTooltip = styled(({ className, ...props }) => (
  <CustomTooltip
    {...props}
    arrow
    placement="bottom"
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
    padding: '10px 15px',
  },
}));

const CollectionSocials = ({ socials, isUpcoming, policyId, collection }) => {
  const {
    state: { isMobile },
  } = useAppContext();
  const theme = useTheme();
  const [copiedTooltip, setCopiedTooltip] = useState(false);

  if (typeof socials === 'string') {
    socials = JSON.parse(socials);
  }

  const handleOpenPolicy = () => {
    window.open(`https://cardanoscan.io/tokenPolicy/${policyId}`, '_blank');
  };

  const handleOpenSocial = ({ name, link }) => {
    window.open(link, '_blank');
    try {
      eventTrack('social', 'open', `${name}-${link}`);
    } catch (err) {}
  };

  const handleCopy = () => {
    copy(policyId)
      .then(() => setCopiedTooltip(true))
      .catch((e) => console.error(e))
      .finally(() => setTimeout(() => setCopiedTooltip(false), 1500));
  };

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: isMobile ? 'space-between' : 'flex-end',
        alignItems: isMobile ? 'center' : 'flex-end',
        flexDirection: isMobile ? 'row-reverse' : 'column',
        width: isMobile ? '100%' : 'auto',
      }}
    >
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
          {!isUpcoming && (
            <CustomTooltip
              style={{ paddingTop: 0 }}
              title="View on Cardanoscan"
              placement="top"
            >
              <IconButton onClick={handleOpenPolicy}>
                <img
                  src={cardanoscan.src}
                  alt="cardanoscan"
                  width={isMobile ? 18 : 20}
                  height={isMobile ? 18 : 20}
                />
              </IconButton>
            </CustomTooltip>
          )}
          {Object.entries(socials || {}).map(([name, link]) => {
            if (
              name === 'price' ||
              name === 'supply' ||
              name === 'promotionText' ||
              name === 'twitterFollowers' ||
              name === 'discordFollowers'
            )
              return null;

            let icon;
            if (name === 'twitter') icon = 'akar-icons:twitter-fill';

            if (name === 'website') icon = 'mdi:web';

            if (name === 'discord') icon = 'simple-icons:discord';

            return (
              <CustomTooltip
                style={{ paddingTop: 0 }}
                key={name}
                title={`Open ${name}`}
                placement="top"
              >
                <IconButton
                  onClick={() => handleOpenSocial({ name, link })}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Icon
                    icon={icon}
                    style={{
                      fontSize: isMobile ? 18 : isUpcoming ? 22 : 25,
                      color: collection.featured
                        ? 'white'
                        : theme.palette.mode === 'light'
                        ? 'rgba(0, 0, 0, 0.65)'
                        : '#fff',
                    }}
                  />
                  {name === 'twitter' && (
                    <span
                      style={{ fontSize: isMobile ? 12 : 14, marginLeft: 1 }}
                    >
                      {socials.twitterFollowers}
                    </span>
                  )}
                  {name === 'discord' && (
                    <span
                      style={{ fontSize: isMobile ? 12 : 14, marginLeft: 1 }}
                    >
                      {socials.discordFollowers}
                    </span>
                  )}
                </IconButton>
              </CustomTooltip>
            );
          })}
          {!isUpcoming && (
            <Box style={{}}>
              <BookmarkedBadge
                showAmount
                kind="collection"
                identifier={policyId}
                width={isMobile ? 24 : isUpcoming ? 25 : 30}
                additionalInfo={collection}
                color={collection.featured ? 'white' : 'var(--logoColor)'}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box>
        {policyId && (
          <CustomTooltip
            style={{ paddingTop: 0 }}
            title={copiedTooltip ? 'Copied!' : 'Copy policy ID'}
            placement="left"
          >
            <Box className={styles.policyIdContainer} onClick={handleCopy}>
              {`Policy: ${formatPolicyId(policyId)}`}
            </Box>
          </CustomTooltip>
        )}
      </Box>
    </Box>
  );
};

export default CollectionSocials;
