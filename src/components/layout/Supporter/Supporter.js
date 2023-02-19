import styles from './Supporter.module.scss';
import supporter from 'assets/placeholder.png';
import logo from 'assets/128x128square.png';
import { Link } from '@mui/material';
import { eventTrack } from 'config/analytics';
import CustomTooltip from 'components/common/CustomTooltip';

const Supporter = ({
  link,
  image,
  title = 'To get this gem spot for your project please DM us on Twitter or Discord. Or send an email to cnftpredator@gmail.com',
  predator,
  containerStyle,
  gemStyle,
}) => {
  const trackGemClick = () => {
    try {
      eventTrack('gem', 'click', link);
    } catch (err) {
      console.log('GEM ERROR', err);
    }
  };

  return (
    <CustomTooltip title={title}>
      <Link
        href={link || '#'}
        target="_blank"
        rel="noopener"
        onClick={trackGemClick}
      >
        <div className={styles.container} style={containerStyle}>
          <img
            src={
              predator
                ? logo
                : image
                ? image.hasOwnProperty('src')
                  ? image.src
                  : image
                : supporter.src
            }
            alt="project img"
            style={{
              border: link ? 'none' : 'border: 1px solid white',
              width: '37.5px',
              height: '37.5px',
              borderRadius: '25%',
              marginRight: '5px',
              ...gemStyle,
            }}
          />
        </div>
      </Link>
    </CustomTooltip>
  );
};

export default Supporter;
