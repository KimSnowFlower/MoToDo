import React from 'react';
import styles from './OptionBar.module.css'; // CSS 모듈을 가져옵니다.

const OptionBar = () => {
  return (
    <div className={styles.optionBar}>
      <button className={styles.optionButton}>1</button>
      <button className={styles.optionButton}>2</button>
      <button className={styles.optionButton}>3</button>
    </div>
  );
};

export default OptionBar;
