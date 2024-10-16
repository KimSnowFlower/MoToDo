import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './GroupToDo.module.css';

const GroupToDo = ({groupName, groupId}) => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [showInput, setShowInput] = useState(false);


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
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await axios.post('http://localhost:5000/api/groupTodos',
                {
                    groupId: groupId,
                    content: newNote,
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
            setShowInput(false);
        } catch(error) {
            setError(error.message);
        }
    };

    const handleDeletNote = async (id) => {
        const token = localStorage.getItem('jwtToken');
        const noteToDelete = notes.find(note => note.id === id);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

        try {
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

    return (
        <div className={styles.groupTodoContainer}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>{groupName} Check List </h2>
                <button className={styles.addButton} onClick={() => setShowInput(!showInput)}></button>
            </div>

            {loading}

            <ul className={styles.todoLists}>
                {notes.map((note) => (
                    <li key={note.id}>
                        <input type="checkbox"/>
                        <p>{note.content}</p>
                        <button onClick={() => handleDeletNote(note.id)}>Delete</button>
                    </li>
                ))}
            </ul>

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
        </div>
    );
}

export default GroupToDo;