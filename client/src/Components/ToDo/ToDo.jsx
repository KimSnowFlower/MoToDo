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
        setNotes((prevNotes) => [...prevNotes, response.data]); // 서버에서 반환한 새로 추가된 노트 사용
        setNewNote('');
        setShowInput(false); // 입력 후 입력창 숨기기
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDeleteNote = async (id) => {
    // 삭제할 노트의 내용을 찾기
    const noteToDelete = notes.find(note => note.id === id);

    console.log(id);
  
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      fetchNotes();

    } catch (error) {
      console.error("Error deleting note:", error); // 콘솔에 에러 출력
      setError(error.message);
      // 에러 발생 시 삭제된 항목을 다시 복구하는 로직을 추가
      setNotes((prevNotes) => [...prevNotes, noteToDelete]); // 원래 노트를 복구
    }
  };  

  return (
    <div className={styles.todoContainer}>
      <div className={styles.header}>
        <h2>To Do - Check List</h2>
        <button onClick={() => setShowInput(!showInput)} className={styles.addButton}>
          +
        </button>
      </div>
      
      {loading && <p>Loading...</p>} {/* 로딩 상태 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 표시 */}

      <div className={styles.inputContainer}>
        {showInput && (
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a new note"
            />
            <button onClick={handleAddNote}>Add</button>
          </div>
        )}
      </div>

      <ul className={styles.homeLists}>
        {notes.map((note) => (
          <li key={note.id}>
            <input type="checkbox" />
            <p>{note.content}</p>
            <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );  
};

export default ToDo;
