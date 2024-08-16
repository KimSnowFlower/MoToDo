import React from 'react';
import styles from './Friends.module.css'; // CSS 모듈로 변경
import MenuBar from '../MenuBar/MenuBar';

const Friends = () => {
    return (
        <div className={styles.totalPage}>
            <div className={styles.menuBar}>
                <MenuBar />
            </div>
            <div className={styles.friendsMain}>
            </div>
        </div>
    );
};

export default Friends;
