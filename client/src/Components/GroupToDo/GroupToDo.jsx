import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './GroupToDo.module.css';

const GroupToDo = ({groupName, groupId}) => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);


    // fetch 함수
    const fetchNotes = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://localhost:5000/api/groupTodos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    groupId: groupId,
                }
            });
            const data = response.data.gTodo;

            setNotes(data);
        } catch(error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleAddNote = async () => {
        if (!newNote.trim()) return; // 빈 노트 방지

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.post('http://localhost:5000/api/groupTodos',
                {
                    groupId: groupId,
                    content: newNote,
                    completed: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            const createdNote = response.data.newTodo;

            setNotes((prevNotes) => [...prevNotes, createdNote]);
            setNewNote('');
        } catch(error) {
            setError(error.message);
        }
    };

    const handleDeleteNote = async (id) => {
        const noteToDelete = notes.find(note => note.id === id);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.delete(`http://localhost:5000/api/groupTodos/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
        } catch(error) {
            setError(error.message);
            setNotes((prevNotes) => [...prevNotes, noteToDelete]);
        }
    }

    const handleToggleComplete= async (id) => {
        const note = notes.find(note => note.id === id);
        const updatedNote = { ...note, completed: !note.completed };

        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? updatedNote : note
        ));

        try {
            const token = localStorage.getItem('jwtToken');
            await axios.patch(`http://localhost:5000/api/groupTodos/${id}`, { 
                completed: updatedNote.completed 
                }, { 
                    headers: { 
                        Authorization: `Bearer ${token}`, 
                        'Content-Type': 'application/json' 
                    } 
                }
            );
        } catch (error) {
            setError(error.message);
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === id ? { ...note, completed: !updatedNote.completed } : note
            ));
        }
    };

    return (
        <div className={styles.groupTodoContainer}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>{groupName} To Do </h2>
            </div>

            {loading}

            <ul className={styles.todoLists}>
                {notes.map((note) => (
                    <li key={note.id}>
                    <input
                        className={styles.noteCheckBox}
                        type="checkbox"
                        checked={note.completed}
                        onChange={() => handleToggleComplete(note.id)}
                    />
                    <p className={note.completed ? styles.completed : styles.noteContent}>{note.content}</p>
                    <button className={styles.deleteButton} onClick={() => handleDeleteNote(note.id)}></button>
                </li>
                ))}
            </ul>

            <div className={styles.inputContainer}>
                <input
                    className={styles.taskInput}
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add New Task"
                />
                <button className={styles.sendButton} onClick={handleAddNote}>등록</button>
            </div>
        </div>
    );
}

export default GroupToDo;