import { useState, useRef, useEffect } from 'react';
import styles from './Sticky.module.css';
import MenuBar from '../MenuBar/MenuBar';
import axios from 'axios';

export default function StickyNotesApp() {
    const [notes, setNotes] = useState([]);
    const [allowMove, setAllowMove] = useState(false);
    const stickyNoteRefs = useRef([]);
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);
    const [movingNoteIndex, setMovingNoteIndex] = useState(null);

    useEffect(() => {
        /*fetchStickyNotes();*/
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

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log(data.sticky); // stickyResults 배열 출력
        } catch (error) {
            console.error('Error fetching sticky notes:', error);
        }
    };

    const addNote = async () => {
        const token = localStorage.getItem('jwtToken');
        const newNote = {
            content: '', 
            color: 'yellow', 
            position_x: 50, 
            position_y: 30, 
            width: 200, 
            height: 200
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
            
            const data = response.data;

            if (response.status !== 201) {  
                throw new Error('Failed to create sticky note');
            }
    
            const createdNote = data;
            setNotes((prevNotes) => [...prevNotes, createdNote]);
        } catch (error) {
            console.error('Error adding sticky note:', error);
        }
    };    

    const removeStickyNote = async (stickyNoteId) => {  // 변수 이름 변경
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
    
            // stickyNoteId를 사용하여 노트를 필터링
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
            const x = e.clientX - dx;
            const y = e.clientY - dy;

            noteElement.style.left = `${x}px`;
            noteElement.style.top = `${y}px`;
        }
    };

    const handleMouseUp = async () => {
        if (movingNoteIndex !== null) {
            const noteElement = stickyNoteRefs.current[movingNoteIndex];
            const content = noteElement.querySelector('textarea').value;

            const noteId = notes[movingNoteIndex]?.sticky.insertId;

            console.log('Updating note ID:', noteId);  // 로그 추가
            const updatedNote = {
                content,
                color: 'yellow',
                position_x: noteElement.style.left,
                position_y: noteElement.style.top,
                width: 200,
                height: 200
            };

            const token = localStorage.getItem('jwtToken');

            try {
                const response = await axios.put(`http://localhost:5000/api/stickys/${noteId}`,
                    updatedNote,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                if (response.status !== 200) {
                    throw new Error('Failed to update sticky note');
                }
            } catch (error) {
                console.error('Error updating sticky note:', error);
            } finally {
                setMovingNoteIndex(null); // 이동 중인 sticky note의 인덱스 초기화
            }
        }
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
                    key={item.sticky.insertId}
                    ref={el => stickyNoteRefs.current[index] = el}
                    style={{ position: 'absolute', left: item.position_x, top: item.position_y }} // API에서 받아온 위치로 설정
                >
                    <div
                        className={styles['sticky-note-header']}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                    >
                        <div>Sticky Note</div>
                        <div className={styles.close} onClick={() => removeStickyNote(item.sticky.insertId)}>&times;</div>
                    </div>
                    <textarea cols="30" rows="10" defaultValue={item.content}></textarea>
                </div>
            ))}
        </div>
    );
}
