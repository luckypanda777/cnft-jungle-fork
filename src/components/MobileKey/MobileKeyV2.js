import { CircularProgress, Switch } from '@mui/material';
import { Box } from '@mui/system';
import {
  createMobileWalletKey,
  editWalletSettings,
  getWalletMe,
} from 'apiProvider';
import { useAppContext } from 'context/AppContext';
import { useContext, useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import logo from 'assets/junglelogoplain.png';

import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButtonV2';
import useWindowSize from 'hooks/useWindowSize';
import CustomTooltip from 'components/common/CustomTooltip';
import { copy } from 'components/CollectionRating/CollectionSocials';

const MobileKey = () => {
  const { width } = useWindowSize();
  const [loading, setLoading] = useState(false);
  const [copiedTooltip, setCopiedTooltip] = useState(false);
  const [mobileKey, setMobileKey] = useState('');
  const {
    state: { walletInfo },
  } = useAppContext();

  useEffect(() => {
    if (mobileKey) {
      setMobileKey('');
    }
  }, [walletInfo.address]);

  const generateMobileKey = async () => {
    setLoading(true);
    try {
      const mobileKey = await createMobileWalletKey().then(
        (data) => data.mobileAccessKey
      );
      setMobileKey(mobileKey);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    copy(mobileKey || walletInfo.mobileAccessKey)
      .then(() => setCopiedTooltip(true))
      .catch((e) => console.error(e))
      .finally(() => setTimeout(() => setCopiedTooltip(false), 1500));
  };

  return (
    <Box sx={{ mb: '30px', mt: '20px' }}>
      <span style={{ fontSize: 18 }}>Mobile Key</span>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          mt: '15px',
        }}
      >
        {walletInfo.loading ? (
          <CircularProgress size={18} sx={{ color: 'var(--primaryColor)' }} />
        ) : mobileKey ||
          (!walletInfo.mobileAccessKeyUsed && walletInfo.mobileAccessKey) ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 0.25 }}>
            <Box>
              <span style={{ fontSize: 14 }}>Scan to open or copy</span>
              <CustomTooltip
                title={copiedTooltip ? 'Copied!' : 'Copy mobile key'}
                placement="left"
              >
                <Box
                  onClick={handleCopy}
                  sx={{ cursor: 'pointer', color: 'var(--logoColor)' }}
                >
                  <span style={{ width: 250, fontSize: 13 }}>
                    {mobileKey || walletInfo.mobileAccessKey}
                  </span>
                </Box>
              </CustomTooltip>
            </Box>
            <QRCode
              value={`jungleapp://login?mobileAccessKey=${
                mobileKey || walletInfo.mobileAccessKey
              }`}
              bgColor="black"
              fgColor="#d5317c"
              // removeQrCodeBehindLogo
              logoImage={logo.src}
              logoWidth={75}
              logoHeight={75}
              qrStyle="dots"
            />
          </Box>
        ) : (
          <WalletButtonBase
            sx={{
              flex: 1,
              backgroundColor: 'var(--headerSearchBgColor)',
              color: 'var(--whiteColor)',
              height: 44,
              fontSize: 12,
              '&:hover': {
                backgroundColor: 'var(--primaryColor)',
                color: 'var(--whiteColor)',
                opacity: 0.9,
              },
              '&.Mui-disabled': {
                color: 'var(--whiteColor)',
              },
            }}
            disabled={walletInfo.loading || !walletInfo.address}
            onClick={generateMobileKey}
          >
            <Box
              sx={{
                display: 'flex',
                columnGap: 1,
                alignItems: 'center',
              }}
            >
              {loading ? (
                <CircularProgress size={18} sx={{ color: 'white', p: 0.25 }} />
              ) : (
                <span>
                  {walletInfo.address ? 'Generate Key' : 'Connect Wallet'}
                </span>
              )}
            </Box>
          </WalletButtonBase>
        )}
      </Box>
    </Box>
  );
};

export default MobileKey;
