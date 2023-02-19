import {
  ButtonBase,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { specialPricing, tierPrices } from './pricing-features';
import { useTheme } from '@mui/material/styles';
import styles from './Features.module.scss';
import Accordion from 'components/common/Accordion';
import AccordionActiveLabel from 'components/common/AccordionActiveLabel';

const SpecialPricing = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        textAlign: 'center',
        backgroundColor: 'var(--tagBg)',
        borderRadius: 3,
        my: 3,
        p: 3,
        color: 'var(--fontColor)',
        fontFamily: 'newgilroymedium',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
        Special pricing for special collections
      </Typography>

      {specialPricing.map((collection, index) => (
        <Accordion
          className={styles.specialPricingFeature}
          label={
            <AccordionActiveLabel
              label={
                <span style={{ marginLeft: 20, color: 'var(--fontColor)' }}>
                  {collection.name}
                </span>
              }
              variant="filled"
              fontSize={18}
              icon={
                collection.icon
                  ? collection.icon
                  : theme.palette.mode === 'light'
                  ? collection.lightIcon
                  : collection.darkIcon
              }
            />
          }
        >
          <ListItem
            sx={{
              p: 0,
              m: 0,
              textAlign: 'left',
            }}
          >
            <ListItemText
              style={{ fontSize: 16, maxWidth: 275 }}
              primaryTypographyProps={{
                fontWeight: 'bold',
                color: 'var(--fontColor)',
              }}
            >
              Role
            </ListItemText>
            <ListItemText
              style={{ fontSize: 16, maxWidth: 300 }}
              primaryTypographyProps={{
                fontWeight: 'bold',
                color: 'var(--fontColor)',
              }}
            >
              Rules
            </ListItemText>
            <ListItemText
              style={{ fontSize: 16, maxWidth: 300 }}
              primaryTypographyProps={{
                fontWeight: 'bold',
                color: 'var(--fontColor)',
              }}
            >
              Discount
            </ListItemText>
            <ListItemText
              style={{ fontSize: 16, maxWidth: 350 }}
              primaryTypographyProps={{
                fontWeight: 'bold',
                color: 'var(--fontColor)',
              }}
            >
              {collection.name === 'Wenno Cat' ? (
                <>
                  <span>Bonus</span>
                </>
              ) : (
                <>
                  {tierPrices.map((tier, tierIndex) => (
                    <>
                      <span style={{ color: tier.tierColor }}>{tier.name}</span>
                      {tierIndex !== tierPrices.length - 1 && ' / '}
                    </>
                  ))}
                  {' / '} month
                </>
              )}
            </ListItemText>
          </ListItem>
          <Divider sx={{ my: 1.5 }} />
          <List>
            {collection.rows.map((feature, featureIndex) => (
              <>
                <ListItem
                  key={featureIndex}
                  sx={{
                    // display: 'flex',
                    // alignItems: 'center',
                    p: 0,
                    m: 0,
                    textAlign: 'left',
                  }}
                >
                  <ListItemText
                    style={{
                      fontSize: 16,
                      width: 100,
                      color: 'var(--fontColor)',
                    }}
                  >
                    <Box style={{ display: 'flex', alignItems: 'center' }}>
                      {feature.icon}
                      <span style={{ marginLeft: 5 }}>{feature.name}</span>
                    </Box>
                  </ListItemText>
                  <ListItemText
                    style={{
                      fontSize: 16,
                      marginLeft: 5,
                      width: 100,
                      color: 'var(--fontColor)',
                    }}
                  >
                    {feature.rule}
                  </ListItemText>
                  <ListItemText
                    style={{
                      fontSize: 16,
                      marginLeft: 5,
                      color: 'var(--fontColor)',
                    }}
                  >
                    {feature.stackable ? (
                      <>
                        <span
                          style={{
                            color: 'var(--fontColor)',
                            fontWeight: 'bold',
                          }}
                        >
                          {feature.discountPercentage}% for each up to{' '}
                          {feature.maxDiscount}%
                        </span>
                      </>
                    ) : (
                      <>
                        <span style={{ color: '#51c775', fontWeight: 'bold' }}>
                          {feature.discountPercentage}%{' / '}
                        </span>
                        <span style={{ color: '#ffc107', fontWeight: 'bold' }}>
                          {feature.discountPercentage}%{' / '}
                        </span>
                        <span
                          style={{
                            color: 'var(--logoColor)',
                            fontWeight: 'bold',
                          }}
                        >
                          {feature.discountPercentage * 0.5}%
                        </span>
                      </>
                    )}
                  </ListItemText>
                  <ListItemText
                    style={{
                      fontSize: 16,
                      marginLeft: 5,
                      color: 'var(--fontColor)',
                    }}
                  >
                    {feature.pricingText ? (
                      <>
                        <span>{feature.pricingText}</span>
                      </>
                    ) : (
                      tierPrices.map((tier, tierIndex) => {
                        return (
                          <>
                            <span
                              key={tier.name}
                              style={{
                                color: tier.tierColor,
                                fontWeight: 'bold',
                              }}
                            >
                              {Math.round(
                                tier.monthlyPrice *
                                  (1 -
                                    (feature.discountPercentage / 100) *
                                      (tier.name === 'Hunter'
                                        ? 1
                                        : tier.name === 'Apex'
                                        ? 1
                                        : 0.5))
                              )}
                              $ in ADA
                            </span>
                            <span
                              style={{
                                color: tier.tierColor,
                                fontWeight: 'bold',
                                fontSize: 14,
                              }}
                            >
                              {tier.inviteOnly && '(Invite Only)'}
                            </span>
                            {tierIndex !== tierPrices.length - 1 && ' / '}
                          </>
                        );
                      })
                    )}
                  </ListItemText>
                </ListItem>
                {featureIndex !== collection.rows.length - 1 && (
                  <Divider sx={{ my: 1.5 }} />
                )}
              </>
            ))}
          </List>
        </Accordion>
      ))}
    </Box>
  );
};

export default SpecialPricing;
