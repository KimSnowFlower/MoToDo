import { useState, useRef, useEffect } from 'react';
import styles from './Sticky.module.css';
import MenuBar from '../MenuBar/MenuBar';

export default function StickyNotesApp() {
    const [notes, setNotes] = useState([]);
    const [allowMove, setAllowMove] = useState(false);
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
            const response = await fetch('/api/stickys', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
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
        const newNote = { content: '', color: 'yellow', position_x: 50, position_y: 30, width: 200, height: 200 };

        try {
            const response = await fetch('/api/stickys', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newNote),
            });

            if (!response.ok) {
                throw new Error('Failed to create sticky note');
            }

            const createdNote = await response.json();
            setNotes((prevNotes) => [...prevNotes, createdNote]);
        } catch (error) {
            console.error('Error adding sticky note:', error);
        }
    };

    const removeNote = async (noteId) => {
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch(`/api/stickys/${noteId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete sticky note');
            }

            setNotes(notes.filter((item) => item.id !== noteId));
        } catch (error) {
            console.error('Error deleting sticky note:', error);
        }
    };

    const handleMouseUp = async () => {
        if (movingNoteIndex !== null) {
            const noteElement = stickyNoteRefs.current[movingNoteIndex];
            const content = noteElement.querySelector('textarea').value;

            const noteId = notes[movingNoteIndex].id;
            const updatedNote = { content, color: 'yellow', position_x: noteElement.style.left, position_y: noteElement.style.top, width: 200, height: 200 };

            const token = localStorage.getItem('jwtToken');

            try {
                const response = await fetch(`/api/stickys/${noteId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedNote),
                });

                if (!response.ok) {
                    throw new Error('Failed to update sticky note');
                }

                setAllowMove(false);
                setMovingNoteIndex(null);
            } catch (error) {
                console.error('Error updating sticky note:', error);
            }
        }
    };

    const handleMouseDown = (e, index) => {
        setAllowMove(true);
        setMovingNoteIndex(index);

        const noteElement = stickyNoteRefs.current[index];
        const dimensions = noteElement.getBoundingClientRect();

        setDx(e.clientX - dimensions.left);
        setDy(e.clientY - dimensions.top);
    };

    const handleMouseMove = (e) => {
        if (allowMove && movingNoteIndex !== null) {
            const noteElement = stickyNoteRefs.current[movingNoteIndex];
            const x = e.clientX - dx;
            const y = e.clientY - dy;

            noteElement.style.left = `${x}px`;
            noteElement.style.top = `${y}px`;
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
                    key={item.id}
                    ref={el => stickyNoteRefs.current[index] = el}
                    style={{ position: 'absolute', left: item.position_x, top: item.position_y }} // API에서 받아온 위치로 설정
                >
                    <div
                        className={styles['sticky-note-header']}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                    >
                        <div>Sticky Note</div>
                        <div className={styles.close} onClick={() => removeNote(item.id)}>&times;</div>
                    </div>
                    <textarea cols="30" rows="10" defaultValue={item.content}></textarea>
                </div>
            ))}
        </div>
    );
}
