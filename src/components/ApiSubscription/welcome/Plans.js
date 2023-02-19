import { useState } from 'react';
import { createCheckoutSession } from 'apiProvider';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import { Box, CircularProgress } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import styles from '../ApiInfo.module.scss';
import { planData } from '../data/code-examples';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import { useAppContext } from 'context/AppContext';
import useWindowSize from 'hooks/useWindowSize';

// fix

const Plans = () => {
  const { width } = useWindowSize();
  const router = useRouter();
  const { showFeedback } = useContext(FeedbackContext);
  const [loading, setLoading] = useState(false);
  const {
    state: { walletInfo },
  } = useAppContext();

  const handleCreateCheckoutSession = async (priceId) => {
    setLoading(true);
    try {
      const { session } = await createCheckoutSession({ priceId });
      router.push(session.url);
    } catch (err) {
      console.log(err);
      showFeedback({
        message: 'Something went wrong. Please try again.',
        kind: 'error',
        duration: 5000,
      });
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 2,
      }}
    >
      <span style={{ fontSize: 32 }}>Pricing</span>
      <Box className={styles.plansContainer}>
        {planData
          .sort((a, b) => a.price - b.price)
          .map((plan) => {
            return (
              <WhiteCard className={styles.planBox}>
                <img
                  src={plan.icon.src}
                  alt="plan icon"
                  width={width > 1400 ? 75 : 60}
                  style={{ position: 'absolute', right: 5, top: 5 }}
                />
                <span className={styles.planName}> {plan.name}</span>
                <span className={styles.planDescription}>
                  {plan.description}
                </span>
                <span className={styles.planPrice}>${plan.price}/month</span>
                <span className={styles.planDetails}>
                  {plan.details.map((d) => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: 1,
                      }}
                    >
                      <VerifiedBadge verified={true} width={24} />
                      <span>{d}</span>
                    </Box>
                  ))}
                </span>

                <WalletButtonBase
                  className={styles.planButton}
                  onClick={() => handleCreateCheckoutSession(plan.id)}
                  loading={loading}
                  disabled={loading || !walletInfo.address}
                >
                  {loading ? (
                    <CircularProgress size={20} sx={{ color: 'white' }} />
                  ) : !walletInfo.address ? (
                    'Connect Wallet'
                  ) : (
                    `Get started ${plan.price === 0 ? 'for free' : ''}`
                  )}
                </WalletButtonBase>
              </WhiteCard>
            );
          })}
      </Box>
    </Box>
  );
};

export default Plans;
