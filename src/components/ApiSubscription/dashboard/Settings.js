import { createCheckoutSession, getApiSubscription } from 'apiProvider';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { Box, CircularProgress } from '@mui/material';
import { planData } from '../data/code-examples';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import styles from '../ApiInfo.module.scss';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { useRouter } from 'next/router';
import FilterButton from 'components/buttons/FilterButton';
import { useAppContext } from 'context/AppContext';
import CustomTooltip from 'components/common/CustomTooltip';
import { copy } from 'components/CollectionRating/CollectionSocials';

const Settings = () => {
  const {
    state: { walletInfo },
  } = useAppContext();
  const router = useRouter();
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('API Keys');
  const { showFeedback } = useContext(FeedbackContext);
  const [copiedTooltip, setCopiedTooltip] = useState(false);

  const handleCopy = () => {
    copy(billing.apiKey)
      .then(() => setCopiedTooltip(true))
      .catch((e) => console.error(e))
      .finally(() => setTimeout(() => setCopiedTooltip(false), 1500));
  };

  useEffect(() => {
    if (walletInfo.address) {
      fetchApiBilling();
    }
  }, [walletInfo.address]);

  const fetchApiBilling = async () => {
    getApiSubscription().then(({ subscription, user }) =>
      setBilling({ ...subscription, apiKey: user.apiKey })
    );
  };

  const handleCreateCheckoutSession = async (priceId) => {
    setLoading(true);
    try {
      const { session } = await createCheckoutSession({ priceId });
      router.push(session.url);
    } catch (err) {
      showFeedback({
        message: 'Something went wrong. Please try again.',
        kind: 'error',
        duration: 5000,
      });
    }
    setLoading(false);
  };

  const handleTab = (newTab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ width: 'auto', height: 'auto', m: 0, p: 0 }}>
      <Box sx={{ display: 'flex', columnGap: 1 }}>
        <Box
          sx={{
            p: '5px 10px',
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor:
              tab === 'API Keys' ? 'var(--primaryColor)' : 'white',
            border:
              tab === 'API Keys' ? '1px solid var(--primaryColor)' : 'none',
            color: tab === 'API Keys' ? 'white' : 'var(--primaryColor)',
          }}
          onClick={() => handleTab('API Keys')}
        >
          API Keys
        </Box>
        <Box
          sx={{
            p: '5px 10px',
            borderRadius: 2,
            cursor: 'pointer',
            backgroundColor:
              tab === 'Billing' ? 'var(--primaryColor)' : 'white',
            border:
              tab === 'Billing' ? '1px solid var(--primaryColor)' : 'none',
            color: tab === 'Billing' ? 'white' : 'var(--primaryColor)',
          }}
          onClick={() => handleTab('Billing')}
        >
          Billing
        </Box>
      </Box>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress size={25} sx={{ color: 'var(--primaryColor' }} />
        </Box>
      )}

      {tab === 'API Keys' && !loading && (
        <Box sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
            Active since{' '}
            {billing ? (
              moment(billing.start_date * 1000, 'x').fromNow()
            ) : (
              <CircularProgress
                size={14}
                sx={{ color: 'var(--primaryColor' }}
              />
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
            Status:{' '}
            {billing ? (
              billing.status
            ) : (
              <CircularProgress
                size={14}
                sx={{ color: 'var(--primaryColor' }}
              />
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              columnGap: 1,
            }}
          >
            Api Key:{' '}
            {billing ? (
              <CustomTooltip
                title={copiedTooltip ? 'Copied!' : 'Copy api key'}
                placement="right"
              >
                <Box onClick={handleCopy}>
                  <span
                    style={{ color: 'var(--logoColor)', cursor: 'pointer' }}
                  >
                    {billing.apiKey}
                  </span>
                </Box>
              </CustomTooltip>
            ) : (
              <CircularProgress
                size={14}
                sx={{ color: 'var(--primaryColor' }}
              />
            )}
          </Box>
        </Box>
      )}

      {tab === 'Billing' && !loading && billing && (
        <Box className={styles.plansContainer} sx={{ mx: '0 !important' }}>
          {planData
            .map((plan) => ({
              ...plan,
              selected: plan.id === billing.plan.id,
            }))
            .sort((a, b) => a.price - b.price)
            .map((plan) => {
              return (
                <WhiteCard
                  className={styles.planBox}
                  sx={{
                    border: plan.selected
                      ? '3px solid var(--logoColor)'
                      : '3px solid var(--primaryColor)',
                    mx: 0,
                  }}
                >
                  <span className={styles.planName}> {plan.name}</span>
                  <span className={styles.planPrice}>${plan.price}/month</span>
                  <span className={styles.planDetails}>
                    {plan.details.slice(0, 3).map((d) => (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          columnGap: 1,
                        }}
                      >
                        <VerifiedBadge verified={true} width={20} />
                        <span style={{ fontSize: 16 }}>{d}</span>
                      </Box>
                    ))}
                  </span>

                  <WalletButtonBase
                    className={styles.planButton}
                    style={{
                      backgroundColor: plan.selected && 'var(--logoColor)',
                    }}
                    onClick={() => handleCreateCheckoutSession(plan.id)}
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                    ) : plan.selected ? (
                      'Selected'
                    ) : (
                      'Select Plan'
                    )}
                  </WalletButtonBase>
                </WhiteCard>
              );
            })}
        </Box>
      )}
    </Box>
  );
};

export default Settings;
