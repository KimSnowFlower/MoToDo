import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ToDo.module.css'; // ToDo CSS 모듈

const ToDo = () => {
  const [notes, setNotes] = useState([]); // 초기값을 빈 배열로 설정
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showInput, setShowInput] = useState(false); // 입력창 표시 여부
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  // 노트 데이터 fetch 함수
  const fetchNotes = async () => {
    setLoading(true); // 로딩 시작
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.get('http://localhost:5000/api/todos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setNotes(response.data); // 서버에서 가져온 노트 데이터
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 컴포넌트가 마운트될 때 노트 데이터를 가져온다
  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post('http://localhost:5000/api/todos', {
          content: newNote,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // 새로 추가된 노트를 상태에 추가
        setNotes((prevNotes) => [...prevNotes, response.data]); // response.data는 새로 추가된 노트
        setNewNote('');
        setShowInput(false); // 입력 후 입력창 숨기기
      } catch (error) {
        setError(error.message);
      }
    }
  };  

  const handleDeleteNote = async (id) => {
    // 우선 삭제된 항목을 프론트엔드 상태에서 제거
    setNotes((prevNotes) => prevNotes.filter(note => note.id !== id));
  
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // 필요시 fetchNotes를 통해 서버에서 최신 상태를 가져옴
      fetchNotes(); // 필요하다면 이 라인을 다시 추가
    } catch (error) {
      setError(error.message);
      // 에러 발생 시 삭제된 항목을 다시 복구하는 로직을 추가할 수도 있습니다
      setNotes((prevNotes) => [...prevNotes, { id, content: '삭제된 항목 복구' }]); // 예시로 복구하는 로직
    }
  }  

  return (
    <div className={styles.todoContainer}>
      <div className={styles.header}>
        <h2>To Do - Check List</h2>
        <button onClick={() => setShowInput(!showInput)} className={styles.addButton}>
          +
        </button>
      </div>
      
      {showInput && (
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a new note"
          />
          <button onClick={handleAddNote}>Add</button>
        </div>
      )}

      {!loading && notes.length === 0 && !error && (
        <li>No notes available.</li>
      )}

      <ul className={styles.homeLists}>
        {notes.map((note) => (
          <li key={note.id}>
            <input type="checkbox" />
            <p>{note.content}</p>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button> {/* 삭제 버튼에서 note.id 전달 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToDo;

