import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://192.168.18.91:3000'); // Replace with your backend URL

const SocketComponent = () => {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [receiver, setReceiver] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isLoggedIn) {
            socket.emit('user-joined', username);

            socket.on('message', (data) => {
                setMessages((prev) => [...prev, data]);
            });

            socket.on('connect_error', () => {
                alert('Failed to connect to the server. Please try again later.');
                setIsLoggedIn(false);
            });
        }

        return () => {
            socket.off('message');
            if (isLoggedIn) socket.emit('user-left', username);
        };
    }, [isLoggedIn]);

    useEffect(() => {
        // Auto-scroll to the latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleLogin = () => {
        if (username.trim()) {
            setIsLoggedIn(true);
        } else {
            alert('Please enter a valid username.');
        }
    };

    const sendMessage = () => {
        if (input.trim() && receiver.trim()) {
            const messageData = {
                user: username,
                to: receiver,
                message: input,
                timestamp: new Date().toISOString(),
            };
            socket.emit('message', messageData);
            setInput('');
        } else {
            alert('Message or receiver cannot be empty.');
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
                    <button onClick={handleLogin} style={styles.loginButton}>
                        Join Chat
                    </button>
                </div>
            ) : (
                <div style={styles.chatContainer}>
                    <h2 style={styles.title}>Real-Time Chat</h2>
                    <div style={styles.messagesBox}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={msg.user === username ? styles.sentMessage : styles.receivedMessage}
                            >
                                <div>
                                    <strong>{msg.user}</strong>: {msg.message}
                                </div>
                                <span style={styles.timestamp}>
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            value={receiver}
                            onChange={(e) => setReceiver(e.target.value)}
                            placeholder="Receiver's name..."
                            style={styles.receiverInput}
                        />
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            style={styles.input}
                        />
                        <button onClick={sendMessage} style={styles.sendButton}>
                            Send
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
        backgroundColor: '#f4f7fa',
        fontFamily: 'Arial, sans-serif',
    },
    loginContainer: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '300px',
        margin: '20px',
    },
    chatContainer: {
        width: '100%',
        maxWidth: '700px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
    },
    title: {
        textAlign: 'center',
        backgroundColor: '#007bff',
        color: '#fff',
        margin: 0,
        padding: '12px 0',
        fontSize: '20px',
    },
    messagesBox: {
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        borderBottom: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
    },
    sentMessage: {
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: '20px',
        alignSelf: 'flex-end',
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    receivedMessage: {
        margin: '10px 0',
        padding: '10px',
        backgroundColor: '#e1e1e1',
        borderRadius: '20px',
        alignSelf: 'flex-start',
        maxWidth: '70%',
        wordWrap: 'break-word',
    },
    timestamp: {
        fontSize: '0.8rem',
        color: '#888',
        marginTop: '5px',
        display: 'block',
    },
    inputContainer: {
        display: 'flex',
        padding: '12px',
        borderTop: '1px solid #ddd',
        backgroundColor: '#fff',
    },
    input: {
        flex: 2,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginRight: '10px',
        fontSize: '14px',
    },
    receiverInput: {
        flex: 1,
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        marginRight: '10px',
        fontSize: '14px',
    },
    sendButton: {
        padding: '10px 15px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    loginButton: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        marginTop: '10px',
    },
};

export default SocketComponent;
