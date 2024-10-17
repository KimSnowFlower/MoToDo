import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Notice.module.css';

const Notice = ({ currentPage, groupId }) => {
    const [error, setError] = useState(null);
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [noticeContent, setnoticeContent] = useState('');
    const [contentAuthor, setContentAuthor] = useState('');

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get(`http://localhost:5000/api/notice/${currentPage}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    groupId: groupId,
                }
            });
            const notices = response.data.notices;

            setNotices(notices);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddNotice = async () => {
        if (!newNotice.trim()) return;

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(`http://localhost:5000/api/notice/${currentPage}`, 
                {
                    groupId: groupId,
                    content: newNotice,
                    author: contentAuthor,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const createedNotice = response.data.newNotice;

            setNotices((prevNotices) => [...prevNotices, createedNotice]);
            setNotices('');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteNotice = async (noticeId) => {
        const noticeToDelete = notices.find(notice => notice.id === noticeId);
        setNotices((prevNotices) => prevNotices.filter((notice) => notice.id !== noticeId));

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`http://localhost:5000/api/notice/${currentPage}`, 
                {
                    id: noticeId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
        } catch (error) {
            setError(error.message);
            setNotices((prevNotices) => [...prevNotices, noticeToDelete]);
        }
    };

    const handleUpdateNotice = async(noticeId) => {
        const notice = notices.find(notice => notice.id === noticeId);
        const updatedNotice = { ...notice, content: notice.content };

        setNotices((prevNotices) =>
            prevNotices.map((notice) =>
                notice.id === noticeId ? updatedNotice : notice 
        ));

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.patch(`http://localhost:5000/api/notice/${currentPage}`, 
                {
                    id: noticeId,
                    content: updatedNotice.contend,
                    groupId: groupId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
        } catch (error) {
            setError(error.message);
            setNotices((prevNotices) => 
                prevNotices.map((notice) => 
                    notice.id === noticeId ? {...notice, content: updatedNotice.content} : notice
            ));
        }
    };

    return (
        <div className={styles.noticeContainer}>
            <ul className={styles.noticeLists}>
                {notices.map((notice) => (
                    <li key={notice.id}>
                        <p>{notice.content}</p>
                        <button className={styles.deleteButton} onClick={() => handleDeleteNotice(notice.id)}></button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notice;