import { useRouter } from 'next/router';
import { Box } from '@mui/material';
import WhiteCard from 'components/MarketAnalysis/graphs/WhiteCard';
import styles from './Sniping.module.scss';
import { subData } from './data/snipe-examples';
import { WalletButtonBase } from 'components/buttons/WalletButton/WalletButton';
import VerifiedBadge from 'components/badges/VerifiedBadge';
import PlanFloor from './PlanFloor';
import useWindowSize from 'hooks/useWindowSize';

const Plans = () => {
  const router = useRouter();
  const { width } = useWindowSize();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 2,
      }}
    >
      <span style={{ fontSize: 32 }}>Access Tiers</span>
      <Box className={styles.plansContainer}>
        {subData
          .sort((a, b) => a.price - b.price)
          .map((plan) => {
            return (
              <WhiteCard className={styles.planBox}>
                <span
                  className={styles.topBorder}
                  style={{ backgroundColor: plan.color }}
                />
                <span
                  className={styles.bottomBorder}
                  style={{ backgroundColor: plan.color }}
                />
                <span className={styles.planName}> {plan.name}</span>
                <span className={styles.planDescription}>
                  {plan.description}
                </span>
                <PlanFloor plan={plan} />
                <span
                  className={styles.planDetails}
                  style={{ fontFamily: 'newgilroybold' }}
                >
                  {plan.details.map((d) => (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        columnGap: 1,
                      }}
                    >
                      {plan.icon}
                      <span style={{ paddingTop: 3 }}>{d}</span>
                    </Box>
                  ))}
                </span>

                <WalletButtonBase
                  sx={{
                    backgroundColor: 'transparent',
                    border: `2px solid ${plan.color}`,
                    color: plan.color,
                    width: '100%',
                    marginTop: 2,
                    '&:hover': {
                      backgroundColor: plan.color,
                      color: 'white',
                    },
                  }}
                  onClick={() => window.open(plan.link, '_blank')}
                >
                  {plan.buttonText}
                </WalletButtonBase>
              </WhiteCard>
            );
          })}
      </Box>
      <span
        style={{
          fontSize: 16,
          alignSelf: 'left',
          width: width < 900 ? 300 : 'auto',
          marginTop: 20,
        }}
      >
        *Burns are scheduled to be released in the coming months for orca and
        instant for Apex tier
      </span>
    </Box>
  );
};

export default Plans;
