import { Box } from '@mui/material';
import styles from './Faqs.module.scss';
import JungleLogo from 'assets/icons/jungle.svg';
import mobileLogo from 'assets/junglelogoplain.png';
import useWindowSize from 'hooks/useWindowSize';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import Accordion from 'components/common/Accordion';
import { middlen } from 'utils/shorten';
import { nFormatter } from 'utils/formatCurrency';

const Faqs = ({ collection }) => {
  const { width } = useWindowSize();
  const router = useRouter();

  const collectionName =
    collection?.collection_name || middlen(collection.policy_id, 15);

  return (
    <Box className={styles.faqs}>
      <Box className={styles.links}>
        <Accordion
          className={styles.faq}
          sharp={false}
          label={`What is ${collectionName} collection about?`}
        >
          <Box>{collection.description}.</Box>
        </Accordion>
        <Accordion
          className={styles.faq}
          sharp={false}
          label={`How many NFTs does ${collectionName} have?`}
        >
          <Box>
            {collectionName} consists of {collection.supply} minted NFTs.
          </Box>
        </Accordion>
        <Accordion
          className={styles.faq}
          sharp={false}
          label={`How many listings does ${collectionName} have?`}
        >
          <Box>
            {collectionName} currently has {collection.listings} listings which
            is {nFormatter((collection.listings / collection.supply) * 100, 1)}%
            of the whole supply.
          </Box>
        </Accordion>
        <Accordion
          className={styles.faq}
          sharp={false}
          label={`What is ${collectionName} daily volume?`}
        >
          <Box>
            {collectionName} had {nFormatter(collection.volume_d, 2)} ADA volume
            in the past 24 hours.
          </Box>
        </Accordion>{' '}
        <Accordion
          className={styles.faq}
          sharp={false}
          label={`What is the current price of ${collectionName} collection?`}
        >
          <Box>
            {collectionName} has the floor price of {collection.floor} ADA.
          </Box>
        </Accordion>{' '}
        <Accordion
          className={styles.faq}
          sharp={false}
          label={`How many unique holders does ${collectionName} have?`}
        >
          <Box>
            {collectionName} has {collection.holder_amount} unique wallets
            holding at least one NFT.
          </Box>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Faqs;
