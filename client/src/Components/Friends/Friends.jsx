import React, { useEffect, useState } from 'react';
import styles from './Friends.module.css';
import MenuBar from '../MenuBar/MenuBar';
import { io } from 'socket.io-client';

const socket = io(`${process.env.REACT_APP_API_URL}`);

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [userInfo, setUserInfo] = useState({ id: '', name: '' , student_id: ''});
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // 사용자 정보를 가져오는 함수
    const fetchUserInfo = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/userInfo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('사용자 정보를 가져오는 데 실패했습니다.');
            }

            const data = await response.json();
            setUserInfo({ id: data.id, name: data.name, student_id: data.student_id });
            console.log('User Info:', data);
        } catch (error) {
            console.error('사용자 정보 가져오기 실패:', error);
            setErrorMessage(error.message);
        }
    };

    // 친구 목록을 가져오는 함수
    const fetchFriends = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/friendsList`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('친구 목록을 가져오는 데 실패했습니다.');
            }

            const data = await response.json();
            setFriends(Array.isArray(data.friends) ? data.friends : []);
        } catch (error) {
            console.error('친구 목록 가져오기 실패:', error);
            setErrorMessage(error.message);
        }
    };

    // 채팅 기록을 가져오는 함수
    const fetchChatHistory = async (chatRoomId) => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chatHistory/${chatRoomId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('채팅 기록을 가져오는 데 실패했습니다.');
            }

            const data = await response.json();
            setChatHistory(data.messages); // 메시지 목록을 상태에 설정
        } catch (error) {
            console.error('채팅 기록 가져오기 실패:', error);
            setErrorMessage(error.message);
        }
    };

    // 친구 선택 함수
    const selectFriend = async (friend) => {
        if (selectedFriend?.id === friend.id) {
            setSelectedFriend(null); // 선택된 친구 해제
            setChatHistory([]); // 채팅 기록 초기화
        } else {
            setSelectedFriend(friend);
        
            // 채팅 방 조회 및 생성
            const chatRoomId = await fetchOrCreateChatRoom(userInfo.id, friend.id);
            if (chatRoomId) {
                fetchChatHistory(chatRoomId); // 채팅 기록 조회
                socket.emit('join room', { userId: userInfo.id, friendId: friend.id });
            }
        }
    };

    // 채팅 방 생성 및 조회 함수
    const fetchOrCreateChatRoom = async (userId, friendId) => {
        const token = localStorage.getItem('jwtToken');

        try {
            // 사용자가 참여하고 있는 채팅 방 조회
            const roomsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/chatRooms`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!roomsResponse.ok) {
                throw new Error('채팅 방을 조회하는 데 실패했습니다.');
            }

            const roomsData = await roomsResponse.json();
            const existingRoom = roomsData.chatRooms.find(room => 
                room.otherUserId === friendId // 친구가 포함된 채팅 방 찾기
            );

            if (existingRoom) {
                return existingRoom.chatRoomId; // 이미 존재하는 채팅 방 ID 반환
            }

            // 채팅 방이 없는 경우 생성
            const createResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/chatRoom`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userIds: [userId, friendId] }), // 채팅 방에 참여할 사용자 ID 배열
            });

            if (!createResponse.ok) {
                throw new Error('채팅 방을 생성하는 데 실패했습니다.');
            }

            const createData = await createResponse.json();
            return createData.chatRoomId; // 생성된 채팅 방 ID 반환
        } catch (error) {
            console.error('채팅 방 조회 또는 생성 실패:', error);
            setErrorMessage(error.message);
            return null; // 실패 시 null 반환
        }
    };

    // 초기 데이터 로드 및 소켓 이벤트 설정
    useEffect(() => {
        fetchUserInfo();
        fetchFriends();

        socket.on('chat message', (msg) => {
            setChatHistory((prevChatHistory) => [...prevChatHistory, msg]);
        });

        return () => {
            socket.off('chat message');
        };
    }, []);

    // 채팅 메시지 스크롤 최적화
    useEffect(() => {
        const chatWindow = document.querySelector(`.${styles.chatMessages}`);
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight; // 스크롤을 가장 아래로 이동
        }
    }, [chatHistory]);

    const sendMessage = async () => {
        if (inputMessage.trim() && selectedFriend) {
            const messageData = {
                chat_id: userInfo.id,       // 선택한 친구의 ID
                sender_id: userInfo.id,     // 사용자의 ID
                message: inputMessage,      // 보낼 메시지 내용
            };
    
            // 소켓으로 메시지 전송
            socket.emit('chat message', messageData);
    
            // 대화를 저장하는 API 호출
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/saveMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    },
                    body: JSON.stringify(messageData),
                });
    
                if (!response.ok) {
                    throw new Error('메시지를 저장하는 데 실패했습니다.');
                }
    
                // 채팅 기록 업데이트
                setChatHistory((prevChatHistory) => [...prevChatHistory, { ...messageData, created_at: new Date().toISOString() }]);
                setInputMessage(''); // 입력 필드 초기화
            } catch (error) {
                console.error('메시지 저장 실패:', error);
                setErrorMessage(error.message);
            }
        }
    };    
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
    <div className={styles.totalPage}>
        <MenuBar />
        <div className={styles.friendsMain}>
            <div className={styles.userFriendsContainer}>
                <div className={styles.userInfo}>
                    <span>{userInfo.student_id ? userInfo.student_id : "X"} {userInfo.name ? userInfo.name : "X"}</span>
                    <div className={styles.buttons}>
                        <button className={styles.searchFriendButton}>
                            <img src={require('../Assets/search_button.png')} alt="Search Friend" className={styles.buttonImage} />
                        </button>
                    </div>
                </div>
                <div className={styles.friendsList}>
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                        <div 
                            key={friend.id} 
                            className={`${styles.friendItem} ${selectedFriend?.id === friend.id ? styles.selected : ''}`} 
                            onClick={() => selectFriend(friend)}
                        >
                            {friend.name}
                        </div>
                    ))
                ) : (
                        <div className={styles.noFriends}>친구가 없습니다.</div>
                )}
            </div>
        </div>

            <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>
                    <span>{selectedFriend ? `Chat with ${selectedFriend.name}` : "친구를 선택하세요"}</span>
                </div>
                <div className={styles.chatMessages}>
                    {chatHistory.length > 0 ? (
                        chatHistory.map((msg, index) => (
                            <div key={index} className={`${styles.message} ${msg.sender_id === userInfo.id ? styles.myMessage : styles.theirMessage}`}>
                                <strong>{msg.sender_id === userInfo.id ? userInfo.name : selectedFriend?.name}:</strong> {msg.message}
                            </div>
                        ))
                    ) : (
                        <div className={styles.noMessages}>채팅 메시지가 없습니다.</div>
                    )}
                </div>
                <div className={styles.inputContainer}>
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="메시지를 입력하세요..."
                        className={styles.inputField}
                    />
                    <button onClick={sendMessage} className={styles.sendButton}>전송</button>
                </div>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            </div>
        </div>
    </div>
    );
};

export default Friends;
