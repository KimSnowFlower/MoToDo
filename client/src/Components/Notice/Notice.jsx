import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Notice.module.css';

const Notice = ({ groupName, groupId }) => {
    const [error, setError] = useState(null);
    const [notices, setNotices] = useState([]);
    const [newNotice, setNewNotice] = useState('');
    const [noticeContent, setNoticeContent] = useState('');
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:5000/api/notice', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    groupId: groupId,
                }
            });

            const data = response.data.notices;
            setNotices(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddNotice = async () => {
        if (!newNotice.trim()) return;

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('http://localhost:5000/api/notice', 
                {
                    groupId: groupId,
                    title: newNotice,
                    content: noticeContent,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            const createdNotice = response.data.newNotice;
            setNotices((prevNotices) => [...prevNotices, createdNotice]);
            setNewNotice('');
            setNoticeContent('');
            setShowInput(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteNotice = async (noticeId) => {
        const noticeToDelete = notices.find(notice => notice.id === noticeId);
        setNotices((prevNotices) => prevNotices.filter((notice) => notice.id !== noticeId));

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`http://localhost:5000/api/notice/${noticeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            setError(error.message);
            setNotices((prevNotices) => [...prevNotices, noticeToDelete]);
        }
    };

    const handleUpdateNotice = async (noticeId) => {
        const notice = notices.find(notice => notice.id === noticeId);
        const updatedNotice = { ...notice, content: noticeContent };

        setNotices((prevNotices) =>
            prevNotices.map((notice) =>
                notice.id === noticeId ? updatedNotice : notice
            )
        );

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.patch(`http://localhost:5000/api/notice/${noticeId}`, 
                {
                    content: updatedNotice.content,
                    groupId: groupId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            setError(error.message);
            setNotices((prevNotices) =>
                prevNotices.map((notice) => notice.id === noticeId ? notice : notice)
            );
        }
    };

    return (
        <div className={styles.noticeContainer}>
            <div className={styles.groupName}>
                {groupName} Notices
            </div>
            <div className={styles.noticeLists}>
                {notices.map(notice => (
                    <div key={notice.id} className={styles.noticeOption}>
                        <div className={styles.noticeAuthor}>
                            <div className={styles.author}>{notice.author}</div>
                        </div>
                        <div className={styles.notice}>
                            <div className={styles.noticeHeader}>
                                <div className={styles.noticeTitle}>{notice.title}</div>
                                <button className={styles.updateButton} onClick={() => handleUpdateNotice(notice.id)}></button>
                                <button className={styles.deleteButton} onClick={() => handleDeleteNotice(notice.id)}></button>
                            </div>
                            <div className={styles.noticeContent}>{notice.content}</div>
                        </div>
                    </div>
                ))}
            </div>
            {showInput && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Notice Title" 
                        value={newNotice} 
                        onChange={(e) => setNewNotice(e.target.value)} 
                    />
                    <textarea 
                        placeholder="Notice Content" 
                        value={noticeContent} 
                        onChange={(e) => setNoticeContent(e.target.value)} 
                    />
                    <button onClick={handleAddNotice}>Add Notice</button>
                </div>
            )}
            <button onClick={() => setShowInput(!showInput)}>
                {showInput ? 'Cancel' : 'Add Notice'}
            </button>
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default Notice;
