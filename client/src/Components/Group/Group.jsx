import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios를 import 합니다.
import MenuBar from '../MenuBar/MenuBar';
import styles from './Group.module.css';

const Group = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(""); // 선택된 그룹 초기값을 빈 문자열로 설정
    const [createGroup, setCreateGroup] = useState(false); // 그룹 생성 상태
    const [newGroupName, setNewGroupName] = useState(""); // 새로운 그룹 이름
    const [message, setMessage] = useState("");
    const [isGroupJoined, setIsGroupJoined] = useState(false); // 그룹 접속 여부

    // 그룹 목록을 가져오는 함수
    const fetchGroups = async () => {
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await axios.get("http://localhost:5000/api/groups", {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.length === 0) {
                setMessage("가입할 수 있는 그룹이 없습니다. 그룹을 생성하세요.");
            } else {
                setGroups(response.data);
                setMessage(""); // 성공 시 메시지 초기화
            }
        } catch (error) {
            console.error("그룹 목록을 가져오는 데 오류가 발생했습니다.");
        }
    };

    const handleCreateGroup = async () => {
        const token = localStorage.getItem('jwtToken');
        const groupCode = await generateGroupCode(); // 그룹 코드 생성
    
        if (!newGroupName) {
            setMessage("그룹 이름을 입력해야 합니다.");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:5000/api/createGroup', {
                code: groupCode,
                name: newGroupName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.status === 201) {
                setMessage(`그룹이 생성되었습니다! (그룹 번호: ${groupCode})`);
                setCreateGroup(false);
                fetchGroups();
            } else {
                throw new Error('그룹 생성 실패');
            }
        } catch (error) {
            console.error("그룹 생성 실패:", error);
            setMessage("그룹 생성에 실패했습니다. 다시 시도해 주세요.");
        }
    };    

    // 그룹 코드 생성 함수 (5자리 랜덤 숫자)
    const generateGroupCode = async () => {
        let groupCode;
        let isUnique = false;

        while (!isUnique) {
            groupCode = Math.floor(10000 + Math.random() * 90000); // 5자리 랜덤 코드 생성

            // 그룹 번호의 중복 여부를 확인하기 위한 API 호출
            try {
                const response = await axios.get(`http://localhost:5000/api/checkGroupCode/${groupCode}`);
                if (!response.data.exists) { // 중복되지 않으면
                    isUnique = true; // 중복되지 않은 코드라면 루프 종료
                }
            } catch (error) {
                console.error("그룹 코드 확인 실패:", error);
                setMessage("그룹 코드 확인에 실패했습니다. 다시 시도해 주세요.");
            }
        }
        return groupCode;
    };

    // 그룹 선택 처리
    const handleGroupChange = (event) => {
        setSelectedGroup(event.target.value); // 선택된 그룹을 상태로 설정
    };

    const handleJoinGroup = () => {
        if (selectedGroup) {
            const group = groups.find(g => g.id === Number(selectedGroup));
            
            if (group) {
                setMessage(`${group.name}에 접속합니다.`);
                setIsGroupJoined(true); // 그룹 접속 성공
            } else {
                setMessage("선택된 그룹이 없습니다.");
            }
        } else {
            setMessage("그룹을 선택하세요.");
        }
    };       

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div className={styles.groupPage}>
            <MenuBar />
            {!isGroupJoined ? ( // 그룹에 접속하지 않았을 때
                !createGroup ? (
                    <div className={styles.groupContainer}>
                        <h1>Select Group</h1>
                        {groups.length > 0 ? (
                            <select className={styles.groupSelect} onChange={handleGroupChange} value={selectedGroup}>
                                <option value="" disabled>
                                    그룹을 선택하세요.
                                </option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name} (코드: {group.code})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <p>{message}</p>
                        )}
    
                        {message && <p className={styles.message}>{message}</p>}
    
                        <div className={styles.joinButtonContainer}>
                            <button className={styles.createGroupButton} onClick={() => setCreateGroup(true)}>
                                그룹 생성
                            </button>
                            <button className={styles.connectButton} onClick={handleJoinGroup} disabled={!selectedGroup}>
                                접속
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.createGroupContainer}>
                        <h1>새 그룹 생성</h1>
                        <input
                            type="text"
                            placeholder="그룹 이름을 입력하세요"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className={styles.groupInput}
                        />
                        <button className={styles.createGroupButton} onClick={handleCreateGroup} disabled={!newGroupName}>
                            그룹 생성 완료
                        </button>
                    </div>
                )
            ) : ( // 그룹에 접속했을 때
                <div className={styles.mainGroupContainer}>
                    <div className={styles.toDoContainer}>
                        <h2>To-Do List</h2>
                        {/* To-Do 리스트 컴포넌트 또는 로직 추가 */}
                    </div>
                    <div className={styles.noticeContainer}>
                        <h2>Notice</h2>
                        {/* Notice 컴포넌트 또는 로직 추가 */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Group;
