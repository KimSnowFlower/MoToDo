import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './GroupToDo.module.css';

const GroupToDo = () => {
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
        }
    }

    return (
        <div className={styles.groupTodoContainer}>
            <div className={styles.header}>
                <h2 className={styles.headerTitle}> Check List </h2>
                <button className={styles.addButton}></button>
            </div>
        </div>
    );
}