import ImageWithErrorHandler from 'components/helpers/ImageWithErrorHandler';
import styles from './Chip.module.scss';

const Chip = ({ url, title }) => {
  return (
    <div className={styles.container}>
      <ImageWithErrorHandler
        className={styles.img}
        src={url}
        alt="project img"
      />
      <div className={styles.name}>{title}</div>
    </div>
  );
};

export default Chip;
