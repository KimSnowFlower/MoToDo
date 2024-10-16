import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './GroupToDo.module.css';

const GroupToDo = ({groupName}) => {
    const [notes, setNotes] = useState([]);
    const [error, setError] = useState(null);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(false);

    // fetch 함수
    const fetchNotes = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('jwtToken');
            const response = await axios.get('http://locahost:5000/api/groupTodos', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            //const data = response.data.gTodo;

            //setNotes(response.data.gTodo);
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

        const newTodo = {
            content: newNote,
        };

        try {
            const response = await axios.post('http://localhost:5000/api/groupTodos',
                newTodo,
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
        } catch(eror) {
            setError(error.message);
            setNotes((prevNotes) => [...prevNotes, noteToDelete]);
        }
    }

    return (
        <div className={styles.groupTodoContainer}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}>{groupName} Check List </h2>
                <button className={styles.addButton}></button>
            </div>

            {loading}

            <div className={styles.noteLists}>
                {notes.map((note) => (
                    <li key={note.id}>
                        <input type="checkbox"/>
                        <p>{note.content}</p>
                        <button onClick={() => handleDeletNote(notei.d)}>Delete</button>
                    </li>
                ))}
            </div>
        </div>
    );
}

export default GroupToDo;