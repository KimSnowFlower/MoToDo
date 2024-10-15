import { useState, useRef, useEffect } from 'react';
import styles from './Sticky.module.css';
import MenuBar from '../MenuBar/MenuBar';
import axios from 'axios';

export default function StickyNotesApp() {
    const [notes, setNotes] = useState([]);
    const stickyNoteRefs = useRef([]);
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);
    const [movingNoteIndex, setMovingNoteIndex] = useState(null);

    useEffect(() => {
        fetchStickyNotes();
    }, []);

    const fetchStickyNotes = async () => {
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await axios.get('http://localhost:5000/api/stickys', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const data = response.data.sticky; // stickyResults 배열 출력

            setNotes(data); // 상태에 노트 저장
        } catch (error) {
            console.error('Error fetching sticky notes:', error);
        }
    };

    const addNote = async () => {
        const token = localStorage.getItem('jwtToken');

        const newNote = {
            content: '', 
            position_x: 50,
            position_y: 30,
            width: 100, 
            height: 100
        };

        try {
            const response = await axios.post('http://localhost:5000/api/stickys', 
                newNote, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            const createdNote = response.data;
            setNotes((prevNotes) => [...prevNotes, createdNote]);
        } catch (error) {
            console.error('Error adding sticky note:', error);
        }
    };    

    const removeStickyNote = async (stickyNoteId) => {
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await axios.delete(`http://localhost:5000/api/stickys/${stickyNoteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (response.status !== 200) { 
                throw new Error('Failed to delete sticky note');
            }

            setNotes(notes.filter((item) => item.sticky.insertId !== stickyNoteId));
        } catch (error) {
            console.error('Error deleting sticky note:', error);
        }
    };

    const handleMouseDown = (e, index) => {
        setMovingNoteIndex(index);
        const noteElement = stickyNoteRefs.current[index];
        const dimensions = noteElement.getBoundingClientRect();

        setDx(e.clientX - dimensions.left);
        setDy(e.clientY - dimensions.top);
    };

    const handleMouseMove = (e) => {
        if (movingNoteIndex !== null) {
            const noteElement = stickyNoteRefs.current[movingNoteIndex];
            const containerRect = noteElement.parentElement.getBoundingClientRect();
            const x = e.clientX - dx;
            const y = e.clientY - dy;
    
            // 경계값 계산
            const minX = containerRect.left;
            const minY = containerRect.top;
            const maxX = containerRect.right - noteElement.offsetWidth;
            const maxY = containerRect.bottom - noteElement.offsetHeight;
    
            // 이동 좌표 제한
            noteElement.style.left = `${Math.max(minX, Math.min(x, maxX)) - containerRect.left}px`;
            noteElement.style.top = `${Math.max(minY, Math.min(y, maxY)) - containerRect.top}px`;
        }
    };
    

    const updateContent = async (index, content) => {
        const noteId = notes[index]?.id; // Optional chaining 추가
        console.log(noteId);
    
        // noteId가 undefined일 경우 함수 종료
        if (!noteId) {
            console.error('Note ID is undefined');
            return;
        }
    
        const updatedNote = {
            content,
            position_x: parseFloat(stickyNoteRefs.current[index].style.left.replace('px', '')),
            position_y: parseFloat(stickyNoteRefs.current[index].style.top.replace('px', '')),
            width: 100,
            height: 100
        };
    
        const token = localStorage.getItem('jwtToken');
    
        try {
            const response = await axios.put(`http://localhost:5000/api/stickys/${noteId}`,
                updatedNote,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
    
            if (response.status !== 200) {
                throw new Error('Failed to update sticky note');
            }
    
            // 노트 내용 업데이트
            setNotes((prevNotes) => {
                const newNotes = [...prevNotes];
                newNotes[index] = { ...newNotes[index], content };
                return newNotes;
            });
        } catch (error) {
            console.error('Error updating sticky note:', error);
        }
    };    

    const handleKeyDown = (e, index) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 엔터 키 동작 방지 (줄 바꿈 방지)
            const noteElement = stickyNoteRefs.current[index];
            const content = noteElement.querySelector('textarea').value;
            updateContent(index, content);
        }
    };

    const handleMouseUp = () => {
        setMovingNoteIndex(null); // 이동 중인 sticky note의 인덱스 초기화
    };

    return (
        <div className={styles.container} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <div className={styles.title}>메모장</div>
            <MenuBar />
            <div style={{ marginTop: '10px' }}>
                <button className={styles['sticky-btn']} onClick={addNote}>
                    <img
                        src={require('../Assets/add_button.png')}
                        className={styles.buttonImage}
                    />
                </button>
            </div>

            {notes.map((item, index) => (
                <div
                    className={styles['sticky-note']}
                    key={item.id}
                    ref={el => stickyNoteRefs.current[index] = el}
                    style={{ position: 'absolute', left: item.position_x, top: item.position_y }}
                >
                    <div
                        className={styles['sticky-note-header']}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                    >
                        <div>Sticky Note</div>
                        <div className={styles.close} onClick={() => removeStickyNote(item.id)}>&times;</div>
                    </div>
                    <textarea
                        cols="30"
                        rows="10"
                        defaultValue={item.content}
                        onKeyDown={(e) => handleKeyDown(e, index)} // 엔터 키 처리
                    ></textarea>
                </div>
            ))}
        </div>
    );
}
