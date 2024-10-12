import { useState, useRef } from 'react';
import styles from './Sticky.module.css';
import MenuBar from '../MenuBar/MenuBar';

export default function StickyNotesApp() {
    const [notes, setNotes] = useState([]);
    const [allowMove, setAllowMove] = useState(false);
    const stickyNoteRefs = useRef([]);
    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);
    const [movingNoteIndex, setMovingNoteIndex] = useState(null);

    function addNote() {
        setNotes([...notes, { id: Date.now() }]);
    }

    function removeNote(noteId) {
        setNotes(notes.filter((item) => item.id !== noteId));
    }

    function handleMouseUp() {
        console.log("Mouse up");
        setAllowMove(false);
        setMovingNoteIndex(null);
    }

    function handleMouseDown(e, index) {
        console.log("Mouse down", e.clientX, e.clientY);
        setAllowMove(true);
        setMovingNoteIndex(index);
        
        const noteElement = stickyNoteRefs.current[index];
        const dimensions = noteElement.getBoundingClientRect();
        
        // 현재 클릭 위치에서 메모의 좌측 상단까지의 차이 계산
        setDx(e.clientX - dimensions.left);
        setDy(e.clientY - dimensions.top);
    }
    
    function handleMouseMove(e) {
        console.log("Mouse move", e.clientX, e.clientY);
    
        if (allowMove && movingNoteIndex !== null) {
            const noteElement = stickyNoteRefs.current[movingNoteIndex];
    
            // 마우스 위치에서 오프셋을 빼서 메모의 정확한 위치를 계산
            const x = e.clientX - dx*2.4;
            const y = e.clientY - dy*2.4;
    
            noteElement.style.left = `${x}px`;
            noteElement.style.top = `${y}px`;
    
            console.log("Moving Note to", x, y);
        }
    }
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
                    style={{ position: 'absolute', left: '50px', top: '30px' }} // 기본 위치
                >
                    <div
                        className={styles['sticky-note-header']}
                        onMouseDown={(e) => handleMouseDown(e, index)}
                    >
                        <div>Sticky Note</div>
                        <div className={styles.close} onClick={() => removeNote(item.id)}>&times;</div>
                    </div>
                    <textarea cols="30" rows="10"></textarea>
                </div>
            ))}
        </div>
    );
}