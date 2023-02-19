import { useContext, useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Tooltip } from '@mui/material';
import styles from '../../styles/Sniping.module.scss';
import predatorbanner from 'assets/predator.png';
import { NextSeo } from 'next-seo';
import Input from 'components/common/Input';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import Select from 'components/common/Select';
import { handleSendAda } from 'utils/purchaseNFT';
import axios from 'axios';
import moment from 'moment';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useRouter } from 'next/router';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { getUserByAccessKey, sendSubscription } from 'apiProvider';
import {
  CopiedTooltip,
  copy,
} from 'components/CollectionRating/CollectionSocials';
import Copy from 'assets/copy-icon.svg';
import { MediaIconButton } from 'components/modals/AssetModal/Modal';
import { useAppContext } from 'context/AppContext';
import SpecialPricing from 'components/Pricing/SpecialPricing';

const tierPrices = { hunter: 30, apex: 75, yummi: 100, orca: 250 };

const SEO = {
  title: 'CNFT Jungle - Advanced CNFT Sniping ',
  description: 'Get a huge edge with our advanced sniping tools',
};

const Sniping = () => {
  const router = useRouter();
  const { showFeedback } = useContext(FeedbackContext);
  const {
    state: { walletInfo, isMobile },
  } = useAppContext();

  const [loadingPayment, setLoadingPayment] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [newAccessKey, setNewAccessKey] = useState('');
  const [selectedTier, setSelectedTier] = useState('apex');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [subscriptionLength, setSubscriptionLength] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(false);
  const [loadingUsd, setLoadingUsd] = useState(false);
  const [usd, setUsd] = useState(0);

  const [copiedTooltip, setCopiedTooltip] = useState(false);

  useEffect(() => {
    fetchUsdPrice();
  }, []);

  const handleCopy = () => {
    copy(newAccessKey)
      .then(() => setCopiedTooltip(true))
      .catch((e) => console.error(e))
      .finally(() => setTimeout(() => setCopiedTooltip(false), 1500));
  };

  const fetchUsdPrice = async () => {
    setLoadingUsd(true);
    try {
      const usdRatio = await axios
        .get(`https://cnft-predator.herokuapp.com/usd-history?interval='1d'`)
        .then((res) => res.data.data);

      const usdPrice = usdRatio[usdRatio.length - 1];

      setUsd(usdPrice);
    } catch (err) {
      return showFeedback({
        message: 'Error fetching usd price, please contact support.',
        kind: 'error',
        duration: 5000,
      });
    } finally {
      setLoadingUsd(false);
    }
  };

  const handleTierChange = (e) => {
    const tier = e.target.value;
    console.log(tier, tierPrices[tier]);
    setSelectedTier(tier);
    setPaymentAmount(tierPrices[tier]);
  };

  const handleDiscountPercentageChange = (e) => {
    const discount = e.target.value;
    if (!discount) return setDiscountPercentage('');
    setDiscountPercentage(Math.min(40, discount));
  };

  const handleSubscriptionLengthChange = (e) => {
    const subLength = e.target.value;
    if (!subLength) return setSubscriptionLength('');
    setSubscriptionLength(Math.max(1, Math.round(subLength)));
  };

  const fetchUserByAccessKey = async (accessKey) => {
    setLoadingPayment(true);
    try {
      const user = await getUserByAccessKey({ accessKey }).then(
        (res) => res.user
      );

      if (!user) {
        return showFeedback({
          message: 'User not found or invalid key',
          kind: 'error',
          duration: 5000,
        });
      }
      setUserInfo(user);
    } catch (err) {
      return showFeedback({
        message: 'Request failed or invalid key',
        kind: 'error',
        duration: 5000,
      });
    } finally {
      setLoadingPayment(false);
    }
  };

  const pay = async (renew = false) => {
    if (loadingPayment || loadingUsd) return;

    if (!walletInfo.address) {
      return showFeedback({
        message: 'Please connect wallet to finish payment',
        kind: 'error',
        duration: 5000,
      });
    }

    setLoadingPayment(true);

    const toPay = renew
      ? parseInt(
          (tierPrices[userInfo?.permissions] / usd) *
            (1 -
              Math.min(
                userInfo?.permissions === 'orca' ? 20 : 40,
                discountPercentage
              ) /
                100) *
            (subscriptionLength || 1)
        )
      : parseInt(
          (tierPrices[selectedTier] * (1 - discountPercentage / 100)) / usd
        );

    try {
      const txHash = await handleSendAda({ amount: toPay });

      if (txHash) {
        return sendSubscription({
          ...userInfo,
          amount: toPay,
          renewal: renew,
          permissions: selectedTier,
          times: subscriptionLength,
          txHash,
        })
          .then((data) => {
            console.log(data);
            showFeedback({
              message: 'Payment successful',
              kind: 'success',
              duration: 5000,
            });
            setAccessKey('');
            setDiscountPercentage('');
            setSubscriptionLength('');
            setUserInfo(null);
            setLoadingPayment(false);

            setNewAccessKey(data.accessKey);
          })
          .finally(() => setLoadingPayment(false));
      } else {
        setLoadingPayment(false);
        return showFeedback({
          message: `Payment failed. Please try again or contact support`,
          kind: 'error',
          duration: 5000,
        });
      }
    } catch {
      return showFeedback({
        message: 'Something went wrong during payment',
        kind: 'error',
        duration: 5000,
      });
    } finally {
      setLoadingPayment(false);
    }
  };

  return (
    <>
      <NextSeo {...SEO} />
      <Container maxWidth="xl" sx={{ minHeight: '90vh' }}>
        <Box className={styles.project}>
          <Box className={styles.projectBox}>
            <img
              src={predatorbanner.src}
              alt="predator banner"
              className={styles.banner}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'var(--primaryColor)',
              borderRadius: 2,
              p: 3,
              mt: 2,
              color: 'var(--whiteColor)',
              rowGap: 1,
              textAlign: 'center',
              height: isMobile ? 600 : 300,
              justifyContent: 'center',
            }}
          >
            <span
              style={{ fontSize: 28, marginBottom: 10, padding: '5px 10px' }}
            >
              Manage your subscription
            </span>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                columnGap: 2,
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: 1,
                  width: '100%',
                  maxWidth: 450,
                  mx: 'auto',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    rowGap: 1,
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  {newAccessKey ? (
                    <>
                      <span style={{ fontSize: 20 }}>Your new access key</span>
                      <CopiedTooltip
                        title="Copied!"
                        PopperProps={{
                          disablePortal: true,
                        }}
                        onClose={() => setCopiedTooltip(false)}
                        open={copiedTooltip}
                        disableHoverListener
                      >
                        <div onClick={handleCopy}>
                          <span style={{ fontSize: 20 }}>{newAccessKey}</span>
                          <MediaIconButton color="#5d70f0" onClick={handleCopy}>
                            <Copy width={20} height={20} />
                          </MediaIconButton>
                        </div>
                      </CopiedTooltip>
                      <span style={{ fontSize: 20 }}>Happy sniping!</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: 22 }}>Purchase</span>
                      <Select
                        options={[
                          { label: 'Tier: Hunter', value: 'hunter' },
                          { label: 'Tier: Apex', value: 'apex' },
                          { label: 'Tier: Yummi', value: 'yummi' },
                        ]}
                        value={selectedTier}
                        defaultValue="hunter"
                        onChange={handleTierChange}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                          placeholder="Your holdings discount percentage"
                          sx={{ flex: 1 }}
                          type="number"
                          value={discountPercentage}
                          onChange={handleDiscountPercentageChange}
                        />
                        <Tooltip title="Click to check discounts based on NFTs held">
                          <HelpOutlineIcon
                            sx={{
                              fontSize: 22,
                              marginLeft: 0.25,
                              cursor: 'pointer',
                            }}
                            onClick={() => router.push('/sniping')}
                          />
                        </Tooltip>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Input
                          placeholder="Subscription length (months)"
                          sx={{ flex: 1 }}
                          type="number"
                          value={subscriptionLength}
                          onChange={handleSubscriptionLengthChange}
                        />
                      </Box>
                      <WalletButtonBase
                        style={{
                          flex: 1,
                          backgroundColor: 'white',
                          color: 'black',
                        }}
                        onClick={() => pay()}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            columnGap: 1,
                            alignItems: 'center',
                          }}
                        >
                          {loadingPayment || loadingUsd ? (
                            <CircularProgress
                              size={15}
                              style={{ color: 'var(--textDefaultcolor)' }}
                            />
                          ) : (
                            `Purchase for ${parseInt(
                              ((tierPrices[selectedTier] *
                                (1 - discountPercentage / 100)) /
                                usd) *
                                (subscriptionLength || 1)
                            )} ADA`
                          )}
                        </Box>
                      </WalletButtonBase>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ py: 2, fontSize: 24 }}>OR</Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  rowGap: 1,
                  width: '100%',
                  maxWidth: 450,
                  flexDirection: 'column',
                  mx: 'auto',
                }}
              >
                <span style={{ fontSize: 22 }}>Renew</span>
                <Input
                  placeholder="Enter your access key"
                  sx={{ flex: 1 }}
                  onChange={(e) => setAccessKey(e.target.value)}
                  value={accessKey}
                />
                {userInfo && (
                  <>
                    <Input
                      placeholder="Add x (months)"
                      sx={{ flex: 1 }}
                      type="number"
                      value={subscriptionLength}
                      onChange={handleSubscriptionLengthChange}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Input
                        placeholder="Your holdings discount percentage"
                        type="number"
                        value={discountPercentage}
                        onChange={handleDiscountPercentageChange}
                      />
                      <Tooltip title="Click to check discounts based on NFTs held">
                        <HelpOutlineIcon
                          sx={{
                            fontSize: 22,
                            marginLeft: 0.25,
                            cursor: 'pointer',
                          }}
                          onClick={() => router.push('/sniping')}
                        />
                      </Tooltip>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        rowGap: 0.5,
                      }}
                    >
                      <span>
                        Expires on{' '}
                        {moment(userInfo?.expiresIn).format('DD.MM.YYYY')}
                      </span>
                      <span>Permissions: {userInfo?.permissions}</span>
                    </Box>
                  </>
                )}
                <WalletButtonBase
                  style={{
                    flex: 1,
                    backgroundColor: 'white',
                    color: 'black',
                  }}
                  onClick={() =>
                    !userInfo ? fetchUserByAccessKey(accessKey) : pay(true)
                  }
                >
                  {loadingPayment || loadingUsd ? (
                    <CircularProgress
                      size={15}
                      style={{ color: 'var(--textDefaultcolor)' }}
                    />
                  ) : userInfo ? (
                    `Add ${subscriptionLength || 1} ${
                      subscriptionLength > 1 ? 'months' : 'month'
                    } for ${parseInt(
                      (tierPrices[userInfo?.permissions] / usd) *
                        (1 -
                          Math.min(
                            userInfo?.permissions === 'orca' ? 20 : 40,
                            discountPercentage
                          ) /
                            100) *
                        (subscriptionLength || 1)
                    )} ADA`
                  ) : (
                    'Get subscription info'
                  )}
                </WalletButtonBase>
              </Box>
            </Box>
          </Box>
          <Box style={{ fontSize: 14, marginTop: 10, padding: '5px 10px' }}>
            *New and renewed keys can take up to 12 hours to be activated,
            usually within 1 hour of purchase, but if takes longer please
            contact support.
          </Box>
          <SpecialPricing />
        </Box>
      </Container>
    </>
  );
};

export default Sniping;
