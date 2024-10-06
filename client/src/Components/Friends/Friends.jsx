import React, { useEffect, useState } from 'react';
import styles from './Friends.module.css';
import MenuBar from '../MenuBar/MenuBar';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [userInfo, setUserInfo] = useState({ name: '' });
    const [inputMessage, setInputMessage] = useState('');
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // 사용자 정보를 가져오는 함수
    const fetchUserInfo = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch('http://localhost:5000/api/userInfo', {
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
            setUserInfo({ id: data.id, name: data.name });
        } catch (error) {
            console.error('사용자 정보 가져오기 실패:', error);
            setErrorMessage(error.message);
        }
    };

    // 친구 목록을 가져오는 함수
    const fetchFriends = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch('http://localhost:5000/api/friendsList', {
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
            const response = await fetch(`http://localhost:5000/api/chatHistory/${chatRoomId}`, {
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
            const roomsResponse = await fetch(`http://localhost:5000/api/chatRooms`, {
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
            const createResponse = await fetch(`http://localhost:5000/api/chatRoom`, {
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
                chat_id: userInfo.id,       // 선택한 채팅 방 ID
                sender_id: userInfo.id,     // 사용자의 ID
                message: inputMessage,      // 보낼 메시지 내용
            };
    
            // 소켓으로 메시지 전송
            socket.emit('chat message', messageData);
    
            // 대화를 저장하는 API 호출
            try {
                const response = await fetch('http://localhost:5000/api/saveMessage', {
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

    return (
        <div className={styles.totalPage}>
            <MenuBar />
            <div className={styles.friendsMain}>
                <div className={styles.userFriendsContainer}>
                    <div className={styles.userInfo}>
                        <span>{userInfo.name ? userInfo.name : "X"}의 친구들</span>
                        <div className={styles.buttons}>
                            <button className={styles.addFriendButton}>
                                <img src={require('../Assets/add_button.png')} alt="Add Friend" className={styles.buttonImage} />
                            </button>
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
                            <div>친구가 없습니다.</div>
                        )}
                    </div>
                </div>
                <div className={styles.chatWindow}>
                    {selectedFriend ? (
                        <>
                            <div className={styles.chatUserName}>{selectedFriend.name}</div>
                            <div className={styles.separator} />
                            <div className={styles.chatMessages}>
                                {chatHistory.map((message, index) => (
                                    <div key={index} className={`${styles.message} ${message.senderId === userInfo.id ? styles.sent : styles.received}`}>
                                        <span className={styles.sender}>{message.senderId === userInfo.id ? userInfo.name : selectedFriend.name}</span>
                                        {message.message}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.messageInput}>
                                <input 
                                    type="text" 
                                    value={inputMessage} 
                                    onChange={(e) => setInputMessage(e.target.value)} 
                                    placeholder="메시지를 입력하세요..." 
                                />
                                <button onClick={sendMessage}>전송</button>
                            </div>
                        </>
                    ) : (
                        <div>친구를 선택하세요.</div>
                    )}
                </div>
            </div>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        </div>
    );
};

export default Friends;
