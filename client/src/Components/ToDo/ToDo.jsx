import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ToDo.module.css'; // ToDo CSS 모듈

const ToDo = () => {
  const [notes, setNotes] = useState([]); // 초기값을 빈 배열로 설정
  const [error, setError] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [showInput, setShowInput] = useState(false); // 입력창 표시 여부
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
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
        setNotes((prevNotes) => [...prevNotes, response.data]); // 새로운 노트 추가
        setNewNote('');
        setShowInput(false); // 입력 후 입력창 숨기기
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const token = localStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:5000/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes((prevNotes) => prevNotes.filter(note => note.id !== id)); // 노트 삭제
    } catch (error) {
      setError(error.message);
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

      {loading && <span className={styles.loadingMessage}>Loading...</span>}
      {error && <span className={styles.errorMessage}>Error: {error}</span>}
      
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

      <ul className={styles.homeLists}>
        {notes && notes.length > 0 ? (
          notes.map((note) => (
            <li key={note.id}>
              <p>{note.content}</p>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button> {/* 삭제 버튼 추가 */}
            </li>
          ))
        ) : (
          <li>No notes available.</li>
        )}
      </ul>
    </div>
  );
};

export default ToDo;
