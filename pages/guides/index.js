import { Box } from '@mui/material';
import styles from '../../styles/Guide.module.scss';
import Card from 'components/cards/ArticleCard';

function GuidePage() {
  return (
    <Box className={styles.main}>
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Card
            articleName="How to correctly format metadata for your collection?"
            bulletPoints={[
              'What each field means',
              'What fields are required',
              'Metadata Standards',
              'How to format your metadata',
            ]}
          />
          <Card
            articleName="How to correctly set collection royalties?"
            bulletPoints={[
              'What are royalties',
              'How to set royalties',
              'How to format your metadata',
              'How to use the metadata',
            ]}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Card
            articleName="How to correctly format metadata for your collection?"
            bulletPoints={[
              'What each field means',
              'Metadata Standards',
              'How to format your metadata',
              'How to use the metadata',
            ]}
          />
          <Card
            articleName="How to correctly format metadata for your collection?"
            bulletPoints={[
              'What each field means',
              'Metadata Standards',
              'How to format your metadata',
              'How to use the metadata',
            ]}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Card
            articleName="How to correctly format metadata for your collection?"
            bulletPoints={[
              'What each field means',
              'Metadata Standards',
              'How to format your metadata',
              'How to use the metadata',
            ]}
          />
          <Card
            articleName="How to correctly format metadata for your collection?"
            bulletPoints={[
              'What each field means',
              'Metadata Standards',
              'How to format your metadata',
              'How to use the metadata',
            ]}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Card
            articleName="How to correctly format metadata for your collection?"
            bulletPoints={[
              'What each field means',
              'Metadata Standards',
              'How to format your metadata',
              'How to use the metadata',
            ]}
          />
          <Card
            articleName="How to correctly format metadata for your collection?"
            bulletPoints={[
              'What each field means',
              'Metadata Standards',
              'How to format your metadata',
              'How to use the metadata',
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default GuidePage;
