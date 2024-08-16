import React from 'react';
import { useTheme } from '../Context/themeProvider';
import styles from './OptionBar.module.css';
import { ThemeConsumer } from 'styled-components';

const OptionBar = () => {
  const [ThemeMode, toggleTheme] = useTheme();

  return (
    <div className={styles.optionBar}>
      <button className={styles.optionButton}>1</button>
      <button className={styles.optionButton}>2</button>
      <button className={styles.optionButton} onClick={toggleTheme}>
        {ThemeMode === 'dark' ? 'dark' : 'light'}
      </button>
    </div>
  );
};

export default OptionBar;
