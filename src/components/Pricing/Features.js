import { useContext, useEffect, useState } from 'react';
import {
  ButtonBase,
  CircularProgress,
  Link,
  ListItemText,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { features } from './pricing-features';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import { useTheme } from '@mui/material/styles';
import { Context as FeedbackContext } from 'context/FeedbackContext';
import styles from './Features.module.scss';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import { useAppContext } from 'context/AppContext';
import axios from 'axios';
import SpecialPricing from './SpecialPricing';
// import { ADA_PAYMENT_ADDRESS } from 'config/config';

const ExtensionFeatures = () => {
  const theme = useTheme();
  const { showFeedback } = useContext(FeedbackContext);
  const [yummi, setYummi] = useState(0);
  const [usd, setUsd] = useState(0);
  const [loadingYummi, setLoadingYummi] = useState(false);
  const [loadingUsd, setLoadingUsd] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      'addr1q80ws62nat8mm4zzxtfr50xkjvh46a08s574swjkyxaxarhxms32jj53mt5fyhwru7xpkkdrp9ay7229tx5n4dfdw0hsdwf8kn'
    );
    showFeedback({
      kind: 'success',
      message: 'Address has been copied!',
      duration: 1000,
    });
  };

  useEffect(() => {
    fetchYummiPrice();
    fetchUsdPrice();
  }, []);

  const fetchYummiPrice = async () => {
    setLoadingYummi(true);
    const response = await axios.post(
      'https://stats.sundaeswap.finance/graphql',
      {
        query:
          'query searchPools($query: String!) {\n  pools(query: $query) {\n    ...PoolFragment\n  }\n}\n\nfragment PoolFragment on Pool {\n  apr\n  rewards {\n    apr\n    asset {\n      ...AssetFragment\n    }\n  }\n  assetA {\n    ...AssetFragment\n  }\n  assetB {\n    ...AssetFragment\n  }\n  assetLP {\n    ...AssetFragment\n  }\n  fee\n  quantityA\n  quantityB\n  quantityLP\n  ident\n  assetID\n}\n\nfragment AssetFragment on Asset {\n  assetId\n  policyId\n  assetName\n  decimals\n  logo\n  ticker\n  dateListed\n  sources\n}\n',
        variables: {
          query: 'yummi',
        },
        operationName: 'searchPools',
      }
    );

    const pools = response.data.data.pools[0];
    setYummi(pools.quantityA / pools.quantityB / 1000000);
    setLoadingYummi(false);
  };

  const fetchUsdPrice = async () => {
    setLoadingUsd(true);
    const usdRatio = await axios
      .get(`https://cnft-predator.herokuapp.com/usd-history?interval='1d'`)
      .then((res) => res.data.data);

    const usdPrice = usdRatio[usdRatio.length - 1];

    setUsd(usdPrice);
    setLoadingUsd(false);
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        backgroundColor: '#0D132A',
        borderRadius: 3,
        my: 3,
        p: 3,
        color: 'var(--whiteColor)',
      }}
    >
      <BrowserView>
        {features.map((content, index) => {
          return (
            <Box
              key={index}
              className={[styles.colMd3, styles.pricingCol]}
              sx={{ mb: 2 }}
            >
              <Box className={styles.pricingCard}>
                <Box className={styles.pricingHeader} sx={content.headerStyle}>
                  {content.logo ? (
                    <ButtonBase
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        borderRadius: '50%',
                        p: 3,
                        '&:hover': {
                          cursor: 'pointer',
                          '& p': {
                            color: 'var(--logoColor) !important',
                          },
                        },
                      }}
                      onClick={copyToClipboard}
                    >
                      <ListItemText
                        primary={content.header}
                        secondary={
                          <Typography sx={{ fontSize: 12 }}>
                            Click to copy address
                          </Typography>
                        }
                      />
                    </ButtonBase>
                  ) : (
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{ color: content.tierColor, fontWeight: 'bold' }}
                        color={content.tierColor}
                      >
                        {content.tier}
                      </Typography>
                      {!content.free &&
                        ((content.currency === 'yummi' && loadingYummi) ||
                        loadingUsd ? (
                          <CircularProgress />
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                              textAlign: 'center',
                            }}
                          >
                            {content.monthlyPrice ? (
                              <>
                                {`${
                                  content.currency === 'yummi'
                                    ? parseInt(
                                        content.monthlyPrice / yummi / 0.47
                                      ) +
                                      ' $' +
                                      content.currency
                                    : `$${content.monthlyPriceValue} ` +
                                      `(${parseInt(
                                        content.monthlyPriceValue / usd
                                      )} ADA)`
                                }/month`}
                                <div>or</div>
                              </>
                            ) : (
                              'Invite Only'
                            )}
                            {content.yearlyPrice &&
                              `${
                                content.currency === 'yummi'
                                  ? parseInt(
                                      content.yearlyPrice / yummi / 0.6
                                    ) +
                                    ' $' +
                                    content.currency
                                  : `$${content.yearlyPriceValue} ` +
                                    `(${parseInt(
                                      content.yearlyPriceValue / usd
                                    )} ADA)`
                              }/year`}
                          </Box>
                        ))}
                    </Box>
                  )}
                </Box>
                <Box
                  className={styles.pricingFeature}
                  sx={{ borderRight: index !== 5 && '1px solid white' }}
                >
                  {content.rows.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      style={{ height: 25, textAlign: 'center' }}
                    >
                      <p>
                        {feature === true ? (
                          <CheckIcon
                            fontSize="small"
                            sx={{ color: 'var(--successColor)' }}
                          />
                        ) : feature === false ? (
                          <CloseIcon
                            fontSize="small"
                            sx={{ color: 'var(--errorColor)' }}
                          />
                        ) : feature === 'Paid' ? (
                          <AttachMoneyOutlinedIcon
                            fontSize="small"
                            sx={{ color: 'var(--tertiaryColor)' }}
                          />
                        ) : (
                          feature
                        )}
                      </p>
                    </li>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        })}
      </BrowserView>
      <MobileView>
        <ButtonBase
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            borderRadius: '50%',
            p: 3,
            pb: 0,
            '&:hover': {
              cursor: 'pointer',
              '& p': {
                color: `pink !important`,
              },
            },
            mx: 'auto',
          }}
          onClick={copyToClipboard}
        >
          <ListItemText
            primary={features[0].header}
            secondary={
              <Typography sx={{ fontSize: 12 }}>
                Click to copy address
              </Typography>
            }
          />
        </ButtonBase>
        {features.map((content, index) => {
          return (
            index !== 0 && (
              <Box key={index} className={[styles.colMd3, styles.pricingCol]}>
                <Box className={styles.pricingCard}>
                  <Box
                    className={styles.pricingHeader}
                    sx={content.headerStyle}
                  >
                    {content.logo ? (
                      <ButtonBase
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          borderRadius: '50%',
                          p: 3,
                          '&:hover': {
                            cursor: 'pointer',
                            '& p': {
                              color: `pink !important`,
                            },
                          },
                        }}
                        onClick={copyToClipboard}
                      >
                        <ListItemText
                          primary={content.header}
                          secondary={
                            <Typography sx={{ fontSize: 12 }}>
                              Click to copy address
                            </Typography>
                          }
                        />
                      </ButtonBase>
                    ) : (
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <Typography
                          variant="h5"
                          sx={{ color: content.tierColor }}
                          color={content.tierColor}
                        >
                          {' '}
                          {content.tier}
                        </Typography>
                        {!content.free &&
                          ((content.currency === 'yummi' && loadingYummi) ||
                          loadingUsd ? (
                            <CircularProgress />
                          ) : (
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',
                                textAlign: 'center',
                              }}
                            >
                              {content.monthlyPrice ? (
                                <>
                                  {`${
                                    content.currency === 'yummi'
                                      ? parseInt(
                                          content.monthlyPrice / yummi / 0.6
                                        ) +
                                        ' $' +
                                        content.currency
                                      : `$${content.monthlyPriceValue} ` +
                                        `(${parseInt(
                                          content.monthlyPriceValue / usd
                                        )} ADA)`
                                  }/month`}
                                  <div>or</div>
                                </>
                              ) : (
                                'Invite Only'
                              )}
                              {content.yearlyPrice &&
                                `${
                                  content.currency === 'yummi'
                                    ? parseInt(
                                        content.yearlyPrice / yummi / 0.6
                                      ) +
                                      ' $' +
                                      content.currency
                                    : `$${content.yearlyPriceValue} ` +
                                      `(${parseInt(
                                        content.yearlyPriceValue / usd
                                      )} ADA)`
                                }/year`}
                            </Box>
                          ))}
                      </Box>
                    )}
                  </Box>
                  <Box className={styles.pricingFeature}>
                    {content.rows.map((feature, rowIndex) => {
                      return (
                        rowIndex !== 0 && (
                          <li
                            key={rowIndex}
                            style={{
                              height: 50,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <p>{features[0].rows[rowIndex]}:</p>
                            <p>
                              {feature === true ? (
                                <CheckIcon
                                  fontSize="small"
                                  sx={{ color: theme.palette.success[200] }}
                                />
                              ) : feature === false ? (
                                <CloseIcon
                                  fontSize="small"
                                  sx={{ color: 'pink' }}
                                />
                              ) : (
                                feature
                              )}
                            </p>
                          </li>
                        )
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            )
          );
        })}
      </MobileView>
      <Box sx={{ p: 3, pt: 2, textAlign: 'justify' }}>
        <Typography sx={{ fontSize: 14 }}>
          To purchase the analytics, extension pass or both please send the
          respective amount of $ in ADA to the addess which you can copy by
          clicking the claw in the top left corner of the pricing table and
          contact us on{' '}
          <Link
            className={styles.link}
            href="https://discord.gg/T9Ktk9j5vN"
            target="_blank"
          >
            Discord
          </Link>{' '}
          to get your key.
        </Typography>
        <Typography sx={{ fontSize: 14, py: 1, color: 'goldenrod' }}>
          If you have a referral code please send the amount of $ in ADA minus
          the discount amount, for example if it's 10% discount and you want an
          Apex pass ($50 in ADA * (100%-10%) = $45 in ADA) and please mention
          which code you have used when getting your access key.
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          Hunt is a term used inside the CNFT Predator ecosystem and is
          equivalent to more commonly used word 'snipe'.
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          *Additional features available to purchase for the Apex tier only.
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          **Analytics access can be puchased on it's own without an extension
          features access for $20 in ADA/month or $100 in ADA/6 months
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          ***Features that will be available down the Roadmap.
        </Typography>
        <Typography sx={{ fontSize: 14 }}>
          ****Prices are subject to change
        </Typography>
      </Box>
    </Box>
  );
};

export default ExtensionFeatures;
