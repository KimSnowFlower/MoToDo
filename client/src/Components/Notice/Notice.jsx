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
            const response = await axios.get(`http://localhost:5000/api/notice`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    groupId: groupId,
                }
            });
            setNotices(response.data.notices);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddNotice = async () => {
        if (!newNotice.trim()) return;

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post(`http://localhost:5000/api/notice`, 
                {
                    groupId: groupId,
                    content: newNotice,
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
        ));

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.patch(`http://localhost:5000/api/notice/${noticeId}`, 
                {
                    content: updatedNotice.content, // 오타 수정 (contend → content)
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
                prevNotices.map((notice) =>
                    notice.id === noticeId ? { ...notice, content: noticeContent } : notice
            ));
        }
    };

    return (
        <div className={styles.noticeContainer}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>{groupName} Notice</h2>
                <button
                    className={styles.addButton}
                    onClick={() => setShowInput(!showInput)}
                ></button>
            </div>

            {!showInput ? (
                <ul className={styles.noticeLists}>
                    {notices.map((notice) => (
                        <li key={notice.id}>
                            <p>{notice.content}</p>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteNotice(notice.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={styles.inputContainer}>
                    <div className={styles.inputWrapper}>
                        <div className={styles.inputWrapperHeader}>
                            <p>Title</p>
                            <input
                                className={styles.titleInput}
                                placeholder="Enter title"
                                value={newNotice}
                                onChange={(e) => setNewNotice(e.target.value)}
                            />
                            <button
                                className={styles.sendButton}
                                onClick={handleAddNotice}
                            >
                                Add
                            </button>
                        </div>
                        <div className={styles.inputWrapperBody}>
                            <p>Content</p>
                            <input
                                className={styles.taskInput}
                                placeholder="Enter content"
                                value={noticeContent}
                                onChange={(e) => setNoticeContent(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notice;
