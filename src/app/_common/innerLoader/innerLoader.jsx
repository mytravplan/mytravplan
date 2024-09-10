import { useState, useEffect } from 'react';
import styles from './style.css';

const LoadingBar = () => {
  const [dotCount, setDotCount] = useState(1); 

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev < 6 ? prev + 1 : 1));
    }, 300);  

    return () => clearInterval(interval);
  }, []);

  const loadingText = `please Wait Loading${'.'.repeat(dotCount)}`;

  return (
    <div className={styles.loadingContainer}>
      <div className={`${styles.progressText} loading_bar_handler`}>
        {loadingText}
      </div>
    </div>
  );
};

export default LoadingBar;
