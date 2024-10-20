import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MenuBar from '../MenuBar/MenuBar';
import styles from './Group.module.css';
import GroupToDo from '../GroupToDo/GroupToDo';
import Notice from '../Notice/Notice';

const Group = () => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [modalState, setModalState] = useState({ create: false, join: false, drop: false });
    const [message, setMessage] = useState("");
    const [createGroupName, setCreateGroupName] = useState(""); // 그룹 생성 이름
    const [joinGroupCode, setJoinGroupCode] = useState(""); // 그룹 가입 코드
    const [dropGroupCode, setDropGroupCode] = useState(""); // 그룹 삭제 코드

    // 그룹 목록을 가져오는 함수
    const fetchGroups = async () => {
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/groups`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.length === 0) {
                setMessage("가입할 수 있는 그룹이 없습니다. 그룹을 생성하세요.");
            } else {
                setGroups(response.data);
                setMessage("");
            }
        } catch (error) {
            console.error("그룹 목록을 가져오는 데 오류가 발생했습니다.");
        }
    };

    const handleCreateGroup = async () => {
        const token = localStorage.getItem('jwtToken');
        const groupCode = await generateGroupCode(); // 그룹 코드 생성
    
        if (!createGroupName) {
            setMessage("그룹 이름을 입력해야 합니다.");
            return;
        }
    
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/createGroup`, {
                code: groupCode,
                name: createGroupName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            if (response.status === 201) {
                setMessage(`그룹이 생성되었습니다! (그룹 번호: ${groupCode})`);
                setModalState({ create: false, join: false, drop: false });
                fetchGroups();
            } else {
                throw new Error('그룹 생성 실패');
            }
        } catch (error) {
            console.error("그룹 생성 실패:", error);
            setMessage("그룹 생성에 실패했습니다. 다시 시도해 주세요.");
        }
    };    

    const handleJoinGroup = async () => {
         // joinGroupCode가 숫자인지 확인
         if (!/^\d+$/.test(joinGroupCode)) { // 정규 표현식으로 숫자 확인
            setMessage("그룹 코드는 숫자만 입력해야 합니다.");
            return;
        }

        const token = localStorage.getItem('jwtToken');

        const code = joinGroupCode;
        
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/checkGroupCode/${code}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.data.exists) {
                setMessage("해당 그룹이 존재하지 않습니다.");
                return;
            }

            await axios.post(`${process.env.REACT_APP_API_URL}/api/joinGroup`, {
                groupId: joinGroupCode,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            setMessage("그룹에 성공적으로 가입했습니다.");
            fetchGroups(); 
            setJoinGroupCode(""); 
            handleCloseModal('join');
        } catch (error) {
            console.error("그룹 가입 중 오류가 발생했습니다:", error);
            setMessage("그룹 가입에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    const handleDropGroup = async () => {
        if (!/^\d+$/.test(dropGroupCode)) { // 정규 표현식으로 숫자 확인
            setMessage("그룹 코드는 숫자만 입력해야 합니다.");
            return;
        }
    
        const token = localStorage.getItem('jwtToken');
    
        const code = dropGroupCode;
    
        try {
            // 그룹 ID가 존재하는지 확인
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/checkGroupCode/${code}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
    
            if (!response.data.exists) {
                setMessage("해당 그룹이 존재하지 않습니다.");
                return;
            }
    
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/groups`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    groupId: dropGroupCode,
                },
            });
    
            setMessage("그룹에서 성공적으로 삭제되었습니다.");
            fetchGroups();
            setDropGroupCode("");
            handleCloseModal('drop');
    
        } catch (error) {
            console.error("그룹 삭제 중 오류가 발생했습니다:", error);
            setMessage("그룹 삭제에 실패했습니다. 다시 시도해 주세요.");
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
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/checkGroupCode/${groupCode}`);
                if (!response.data.exists) {
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
    const handleGroupChange = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        
        if (group) {
            setSelectedGroup(groupId);
        } else {
            setMessage("선택된 그룹이 없습니다.");
        }
    };       

    useEffect(() => {
        fetchGroups();
    }, []);

    // 모달을 닫을 때 상태를 초기화하는 함수
    const handleCloseModal = (modalType) => {
        setModalState({ create: false, join: false, drop: false });
        
        if (modalType === 'create') {
            setCreateGroupName(""); // 그룹 생성 입력 초기화
        } else if (modalType === 'join') {
            setJoinGroupCode(""); // 그룹 가입 입력 초기화
        } else if (modalType === 'drop') {
            setDropGroupCode(""); // 그룹 삭제 입력 초기화
        }
    };

    return (
        <div className={styles.groupPage}>
            <MenuBar />
            <div className={styles.groupContainer}>
                {/* 선택된 그룹이 없고 모달이 열리지 않았을 때만 그룹 선택 UI를 보여줌 */}
                {selectedGroup === null && !modalState.create && !modalState.join && !modalState.drop ? (
                    <div className={styles.modalContainer}>
                        <h1 className={styles.modalHeader}>Select Group</h1>
                        <div className={styles.modalBody}>
                            <ul className={styles.groupLists}>
                                {groups.map((group) => (
                                    <li
                                        key={group.id}
                                        className={styles.groupItem}
                                        onClick={() => handleGroupChange(group.id)} // 클릭 시 그룹 접속
                                    >
                                        <p className={styles.groupCode}>{group.name}</p>
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.buttonContainer}>
                                <button className={styles.createButton} onClick={() => setModalState({ create: true, join: false, drop: false })}>
                                    그룹 생성
                                </button>
                                <button className={styles.joinButton} onClick={() => setModalState({ create: false, join: true, drop: false })}>
                                    그룹 가입
                                </button>
                                <button className={styles.dropButton} onClick={() => setModalState({ create: false, join: false, drop: true })}>
                                    그룹 삭제
                                </button>
                            </div>
                        </div>
                    </div>
                ) : ( // 그룹을 선택했거나 모달이 열릴 때
                    <div className={styles.mainGroupContainer}>
                        {selectedGroup !== null && ( // 선택된 그룹이 있을 때만 GroupToDo와 Notice를 표시
                            <>
                                <div className={styles.toDoContainer}>
                                    <GroupToDo groupName={groups.find(g => g.id === selectedGroup)?.name} groupId={selectedGroup} />
                                </div>
                                <div className={styles.noticeContainer}>
                                    <Notice groupName={groups.find(g => g.id === selectedGroup)?.name} groupId={selectedGroup} />
                                </div>
                            </>
                        )}
                    </div>
                )}
                
                {modalState.create && (
                    <div className={styles.modalContainer}>
                        <h1 className={styles.modalHeader}>Create Group</h1>
                        <div className={styles.modalBody}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="그룹 이름을 입력하세요"
                                    value={createGroupName}
                                    onChange={(e) => setCreateGroupName(e.target.value)}
                                    className={styles.groupInput}
                                />
                            </div>
                            <div className={styles.buttonContainer}>
                                <button className={styles.createGroupButton} onClick={handleCreateGroup} disabled={!createGroupName}>
                                    생성하기
                                </button>
                                <button className={styles.cancelButton} onClick={() => handleCloseModal('create')}>
                                    돌아가기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {modalState.join && (
                    <div className={styles.modalContainer}>
                        <h1 className={styles.modalHeader}>Join Group</h1>
                        <div className={styles.modalBody}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="그룹 코드를 입력하세요"
                                    value={joinGroupCode}
                                    onChange={(e) => setJoinGroupCode(e.target.value)}
                                    className={styles.groupInput}
                                />
                            </div>
                            <div className={styles.buttonContainer}>
                                <button className={styles.joinGroupButton} onClick={handleJoinGroup} disabled={!joinGroupCode}>
                                    가입하기
                                </button>
                                <button className={styles.cancelButton} onClick={() => handleCloseModal('join')}>
                                    돌아가기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {modalState.drop && (
                    <div className={styles.modalContainer}>
                        <h1 className={styles.modalHeader}>Drop Group</h1>
                        <div className={styles.modalBody}>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    placeholder="그룹 코드를 입력하세요"
                                    value={dropGroupCode}
                                    onChange={(e) => setDropGroupCode(e.target.value)}
                                    className={styles.groupInput}
                                />
                            </div>
                            <div className={styles.buttonContainer}>
                                <button className={styles.dropGroupButton} onClick={handleDropGroup} disabled={!dropGroupCode}>
                                    삭제하기
                                </button>
                                <button className={styles.cancelButton} onClick={() => handleCloseModal('drop')}>
                                    돌아가기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {message}
            </div>
        </div>
    );
};

export default Group;
