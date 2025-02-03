import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIROUTES';
import Logout from './Logout';
import ChatInput from './ChatInput';
import loader from '../assets/loader.gif';
import { v4 as uuidv4 } from 'uuid';
import { FaTimes } from 'react-icons/fa';

const ChatContainer = ({ currentChat, currentUser, socket }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [arrivalMsg, setArrivalMsg] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndexes, setHighlightedIndexes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef();
    const lastMessageRef = useRef();

    useEffect(() => {
        const getAllMsgs = async () => {
            setLoading(true);
            try {
                const response = await axios.post(getAllMessagesRoute, {
                    from: currentUser._id,
                    to: currentChat._id,
                });
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        if (currentChat) {
            getAllMsgs();
        }
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg,
        });

        socket.current.emit('send-msg', {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        });

        setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on('msg-recieve', (msg) => {
                setArrivalMsg({ fromSelf: false, message: msg });
            });
        }
    }, []);

    useEffect(() => {
        arrivalMsg && setMessages((prev) => [...prev, arrivalMsg]);
    }, [arrivalMsg]);

    useEffect(() => {
        if (highlightedIndexes.length > 0) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentIndex]);

    useEffect(() => {
        if (messages.length > 0) {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (searchTerm) {
            const indexes = [];
            messages.forEach((msg, index) => {
                if (msg.message.toLowerCase().includes(searchTerm.toLowerCase())) {
                    indexes.push(index);
                }
            });
            setHighlightedIndexes(indexes);
            setCurrentIndex(0);
        } else {
            setHighlightedIndexes([]);
            setCurrentIndex(0);
        }
    }, [searchTerm, messages]);

    const navigateHighlights = (direction) => {
        if (highlightedIndexes.length === 0) return;
        setCurrentIndex((prev) => {
            let newIndex = prev + direction;
            if (newIndex < 0) newIndex = highlightedIndexes.length - 1;
            if (newIndex >= highlightedIndexes.length) newIndex = 0;
            return newIndex;
        });
    };

    return (
        <>
            {currentChat && (
                <Container>
                    <div className="chat-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img
                                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                                    alt="avatar"
                                />
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search messages..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && <FaTimes className="clear-icon" onClick={() => setSearchTerm('')} />}
                            {searchTerm && (
                                <>
                                    <button onClick={() => navigateHighlights(-1)}>&uarr;</button>
                                    <button onClick={() => navigateHighlights(1)}>&darr;</button>
                                    <span>{highlightedIndexes.length > 0 ? `${currentIndex + 1}/${highlightedIndexes.length}` : '0/0'}</span>
                                </>
                            )}
                        </div>
                        <Logout />
                    </div>

                    <div className="chat-messages">
                        {loading ? (
                            <div className="loading-container">
                                <img src={loader} alt="Loading..." />
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isHighlighted = highlightedIndexes.includes(index);
                                const isCurrent = index === highlightedIndexes[currentIndex];
                                return (
                                    <div ref={index === highlightedIndexes[currentIndex] ? scrollRef : index === messages.length - 1 ? lastMessageRef : null} key={uuidv4()} className={`message ${msg.fromSelf ? "sended" : "recieved"}`}>
                                        <div className="content" style={{ backgroundColor: isCurrent ? 'blue' : isHighlighted ? '#50434f' : 'transparent' }}>
                                            <p>{msg.message}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <ChatInput handleSendMsg={handleSendMsg} />
                </Container>
            )}
        </>
    );
};

export default ChatContainer;


const Container = styled.div`

    padding-top: 1rem;
    display: grid;
    grid-template-rows:  10% 78% 12%;
    gap: 0.1rem;
    overflow: hidden;

    @media screen and (min-width: 720px) and (max-width:1080px){
      grid-auto-rows: 15% 70% 15%;
      
    }

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;

        .user-details {
            display: flex;
            align-items: center;
            gap: 1rem;

            .avatar {
                img {
                    height: 3rem;
                }
            }

            .username {
                h3 {
                    color: white;
                }
            }
        }

    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: #3f7d71;
        padding: 0.3rem 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        width: 40;
        transition: all 0.3s ease-in-out;
    }

    .search-container input {
        flex-grow: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 0.375rem;
        outline: none;
        background-color: #f4f4f4;
        color: #333;
        font-size: 1rem;
        transition: border-color 0.2s ease-in-out;
    }

    .search-container input:focus {
        border-color: #6C8E70;
        background-color: #fff;
    }

    .clear-icon {
        color: #fff;
        cursor: pointer;
        font-size: 1.2rem;
        transition: color 0.2s;
    }

    .clear-icon:hover {
        color: #f44336;
    }

    .search-container button {
        background: none;
        border: none;
        color: #fff;
        cursor: pointer;
        font-size: 1.2rem;
        transition: transform 0.2s ease-in-out;
    }

    .search-container button:hover {
        transform: scale(1.5);
        color: blue;
    }

    .search-container span {
        font-size: 0.875rem;
        color: #fff;
    }

    .navigation {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .nav-icon {
        cursor: pointer;
        font-size: 1.5rem;
        color: #fff;
        transition: transform 0.2s ease-in-out;
    }

    .nav-icon:hover {
        transform: scale(1.1);
        color: #6C8E70;
    }


    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        
        .message {
            display: flex;
            align-items: center;

            .content {
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
                border-radius: 1rem;
                color: #d1d1d1;

            }
        }

        .sended {
            justify-content: flex-end;
            .content {
                background-color: #4f04ff21;
            }
        }

        .recieved {
            justify-content: flex-start;
            .content {
                background-color: #9900ff20;
            }
        }
    }
`