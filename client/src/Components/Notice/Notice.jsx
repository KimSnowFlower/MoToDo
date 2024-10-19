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
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>{groupName} Notices </h2>
            </div>

            {showInput ? (
                <div className={styles.inputContainer}>
                    <div className={styles.inputHeader}>
                        <p className={styles.inputHeaderText}>글쓰기</p>
                    </div>
                    <div className={styles.titleInputContainer}>
                        <p className={styles.titleInputText}>제목</p>
                        <input 
                            className={styles.titleInput}
                            type="text" 
                            placeholder="제목을 입력해 주세요!" 
                            value={newNotice} 
                            onChange={(e) => setNewNotice(e.target.value)} 
                        />
                    </div>
                    <div className={styles.contentContainer}>
                        <textarea 
                            className={styles.contentInput}
                            placeholder="자세하게 내용을 입력해 주세요!" 
                            value={noticeContent} 
                            onChange={(e) => setNoticeContent(e.target.value)} 
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <button className={styles.uploadButton} onClick={handleAddNotice}>등록하기</button>
                        <button className={styles.closeButton} onClick={() => setShowInput(!showInput)}>취소</button>
                    </div>
                </div>
            ) : (
                <div className={styles.noticeListsContainer}>
                    <ul className={styles.noticeLists}>
                        {notices.map(notice => (
                            <li key={notice.id} className={styles.noticeOption}>
                                <div className={styles.noticeAuthor}>
                                    <div className={styles.author}>{notice.author}</div>
                                </div>
                                    <div className={styles.notice}>
                                        <div className={styles.noticeHeader}>
                                        <div className={styles.noticeTitle}>{notice.title}
                                        </div>
                                        <button className={styles.updateButton} onClick={() => handleUpdateNotice(notice.id)}></button>
                                        <button className={styles.deleteButton} onClick={() => handleDeleteNotice(notice.id)}></button>
                                    </div>
                                        <div className={styles.noticeContent}>{notice.content}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button className={styles.showInputButton} onClick={() => setShowInput(!showInput)}>
                        <div className={styles.buttonText}>글쓰기</div>
                    </button>
                </div>
            )}
    
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};

export default Notice;
