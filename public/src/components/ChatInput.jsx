import React, { useState } from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import { IoMdSend } from 'react-icons/io'
import { BsEmojiSmileFill } from 'react-icons/bs'

const ChatInput = ({ handleSendMsg }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState('');

    const handleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    }

    const handleEmojiClick = (emojiObject) => {
        setMsg((prev) => prev + emojiObject.emoji);
    };


    const sendChat = (e) => {
        e.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(msg);
            setMsg('');
        }
    }

    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPicker} />
                    {showEmojiPicker && (
                        <div className="emoji-picker-container">
                            <Picker onEmojiClick={(emojiObject) => handleEmojiClick(emojiObject)} />
                        </div>
                    )}

                </div>
            </div>

            <form className="input-container" onSubmit={sendChat}>
                <input type="text" placeholder="Type your message here..." value={msg} onChange={(e) => setMsg(e.target.value)} />
                <button className="submit">
                    <IoMdSend />
                </button>
            </form>
        </Container>
    )
}

export default ChatInput;

const Container = styled.div`
    display: grid;
    grid-template-columns: 5% 95%;
    align-items: center;
    background-color: #080420;
    padding: 0 2rem;
    padding-bottom: 0.3rem;
    @media screen and (min-width: 720px) and (max-width:1080px){
        padding: 0 1rem;
        gap: 1rem;
      
    }
    .button-container {
        display: flex;
        align-items: center;
        color: white;
        gap: 1rem;

        .emoji {
            position: relative;
            svg {
                font-size: 1.5rem;
                color: #ffff00c8;
                cursor: pointer;
            }

            .emoji-picker-container {
                position: absolute;
                top: -470px;
                left: 0px;
                background-color: #080420;
                box-shadow: 0 5px 10px #9a86f3;
                border-radius: 8px;
                z-index: 10;
                padding: 0.5rem;

                /* Custom styling for emoji picker */
                .EmojiPickerReact {
                    background-color: #080420 !important;
                    border-color: #9a86f3 !important;
                    box-shadow: 0 5px 10px #9a86f3 !important;
                    
                    .emoji-scroll-wrapper::-webkit-scrollbar {
                        background-color: #080420;
                        width: 5px;
                    }

                    .emoji-scroll-wrapper::-webkit-scrollbar-thumb {
                        background-color: #9186f3;
                    }

                    .emoji-categories {
                        button {
                            filter: contrast(0);
                        }
                    }

                    .emoji-search {
                        background-color: transparent;
                        border-color: #9186f3;
                    }

                    .emoji-group:before {
                        background-color: #080420;
                    }
                }
            }
        }
    }

    .input-container {
        width: 100%;
        border-radius: 2rem;
        display: flex;
        align-items: center;
        gap: 2rem;
        background-color: #ffffff34;

        input {
            width: 90%;
            background-color: transparent;
            color: white;
            border: none;
            padding-left: 1rem;
            font-size: 1.2rem;
            &::selection {
                background-color: #9186f3;
            }
            &:focus {
                outline: none;
            }
        }

        button {
            padding: 0.3rem 2rem;
            border-radius: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #9a86f3;
            border: none;
            @media screen and (min-width: 720px) and (max-width:1080px){
                padding: 0.3rem 1rem;
                svg {
                    font-size: 1rem;

                }
      
            }

            svg {
                font-size: 2rem;
                color: white;
            }
        }
    }
`
