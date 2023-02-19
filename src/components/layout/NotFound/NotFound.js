import React from 'react';
import styles from './NotFound.module.scss';

const NotFound = ({ title }) => {
  return (
    <div className={styles.notfound}>
      <img src='../../cat.webp' alt="questionnable-cat" className={styles.image} />
      <span className={styles.title}>{title}</span>
    </div>
  );
};

export default NotFound;
