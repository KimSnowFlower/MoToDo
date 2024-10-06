import React from 'react';
import MenuBar from '../MenuBar/MenuBar';
import styles from './Group.module.css';

const Group = () => {

    return (
        <div className={styles.groupPage}>
            <MenuBar/>
        </div>
    );
}

export default Group;