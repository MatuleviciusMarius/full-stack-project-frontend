import React from 'react';
import styles from './Loading.module.css';

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingAnimation}></div>
      <div className={styles.loadingText}>Loading...</div>
    </div>
  );
}

export default Loading;
