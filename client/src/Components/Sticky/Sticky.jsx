import { useState, useRef } from 'react';
import './Sticky.css';
import MenuBar from '../MenuBar/MenuBar';

export default function StickyNotesApp() {
    const [notes, setNotes] = useState([]);
    const [allowMove, setAllowMove] = useState(false);
    const stickyNoteRef = useRef();

    const [dx, setDx] = useState(0);
    const [dy, setDy] = useState(0);

    // 노트 추가 함수
    function addNote() {
        setNotes([
            ...notes,
            {
                id: Date.now(),
            },
        ]);
    }

    // 노트 삭제 함수
    function removeNote(noteId) {
        setNotes(notes.filter((item) => item.id !== noteId));
    }

    function handleMouseUP() {
        setAllowMove(false);
    }

    function handleMouseDown(e) {
        setAllowMove(true);
        const dimensions = stickyNoteRef.current.getBoundingClientRect();
        setDx(e.clientX - dimensions.x);
        setDy(e.clientY - dimensions.y);
    }

    function handleMouseMove(e) {
        if (allowMove) {
            const x = e.clientX - dx;
            const y = e.clientY - dy;
            stickyNoteRef.current.style.left = x + "px";
            stickyNoteRef.current.style.top = y + "px";
        }
    }

    return (
        <div className="container"><div className="title">메모장</div>
            <MenuBar />
            <div style={{ marginTop: '10px' }}> {/* 여백 추가 */}
                <button className="sticky-btn" onClick={addNote}>Create Note +</button>
            </div>
        <div className="container"></div>
            {notes.map(item => (
                <div className="sticky-note" key={item.id} ref={stickyNoteRef}>
                    <div
                        className="sticky-note-header"
                        onMouseUp={handleMouseUP}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                    >
                        <div>Sticky Note</div>
                        <div className="close" onClick={() => removeNote(item.id)}>
                            &times;
                        </div>
                    </div>
                    <textarea name="" id="" cols="30" rows="10"></textarea>
                </div>
            ))}
        </div>
    );
}
