import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://192.168.18.91:3000'); // Replace with your backend URL

const GameComponent = () => {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        // Listen for game messages (such as game events)
        socket.on('game-message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('game-message');
        };
    }, []);

    const handleLogin = () => {
        if (username.trim()) {
            setIsLoggedIn(true);
            socket.emit('join-game', username); // Notify server of new user joining
        }
    };

    const sendMove = () => {
        if (input.trim()) {
            socket.emit('make-move', input); // Send move to server
            setInput('');
        }
    };

    return (
        <div style={styles.container}>
            {!isLoggedIn ? (
                <div style={styles.loginContainer}>
                    <h2>Enter Your Name</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your name..."
                        style={styles.input}
                    />
                    <button onClick={handleLogin} style={styles.button}>
                        Join Game
                    </button>
                </div>
            ) : (
                <div style={styles.chatContainer}>
                    <h2 style={styles.title}>Real-Time Game</h2>
                    <div style={styles.messagesBox}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={styles.message}>
                                {msg}
                            </div>
                        ))}
                    </div>
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Make a move..."
                            style={styles.input}
                        />
                        <button onClick={sendMove} style={styles.button}>
                            Send Move
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Styles for the UI
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f0f0',
    },
    loginContainer: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    chatContainer: {
        width: '90%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden',
    },
    title: {
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: '#fff',
        margin: 0,
        padding: '10px 0',
    },
    messagesBox: {
        padding: '10px',
        height: '300px',
        overflowY: 'auto',
        borderBottom: '1px solid #ddd',
    },
    message: {
        margin: '5px 0',
        padding: '5px',
        borderBottom: '1px solid #eee',
    },
    inputContainer: {
        display: 'flex',
        padding: '10px',
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginRight: '10px',
    },
    button: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default GameComponent;
