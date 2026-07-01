import { MyContext } from './MyContext.jsx';
import { useContext } from 'react'
import './Chat.css';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from "react";
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
//react markdown
//rehype-highlight


function Chat() {
    const { newChat, prevChats, reply, setPrompt } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);

    const suggestions = [
        {
            title: "Draft an email",
            text: "Write a polite follow-up email to my project manager requesting a deadline extension.",
            icon: "fa-regular fa-envelope"
        },
        {
            title: "Explain code",
            text: "Explain what recursion is in JavaScript with a simple, clear code example.",
            icon: "fa-solid fa-code"
        },
        {
            title: "Brainstorm ideas",
            text: "Brainstorm 5 creative name ideas for a new AI-powered task management application.",
            icon: "fa-regular fa-lightbulb"
        },
        {
            title: "Code help",
            text: "Write a React functional component that renders a responsive image gallery.",
            icon: "fa-solid fa-cubes"
        }
    ];

    useEffect(() => {
        if (!prevChats?.length || !reply) {
            setLatestReply(null);
            return;
        }

        const lastChat = prevChats[prevChats.length - 1];
        if (lastChat.role !== 'assistant') {
            setLatestReply(null);
            return;
        }

        const content = reply.split(" ");  //individual words

        let idx = 0;
        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));

            idx++;
            if (idx >= content.length) clearInterval(interval);

        }, 40);

        return () => clearInterval(interval);
    }, [reply, prevChats?.length]);

    const hasTyping = latestReply !== null;
    const displayChats = hasTyping ? prevChats.slice(0, -1) : prevChats;

    return (
        <div className="chat-container">
            {newChat && (
                <div className="landing-dashboard">
                    <div className="logo-glow">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                            <path d="M21.3 12.8c.2-.5.3-1 .3-1.6 0-2.8-2.3-5.1-5.1-5.1-.3 0-.6 0-.8.1-.5-.8-1.5-1.3-2.6-1.3-1.6 0-3 1.2-3.2 2.8-.4-.2-.9-.3-1.4-.3-2.8 0-5.1 2.3-5.1 5.1 0 .5.1 1 .3 1.5-.5.5-.8 1.2-.8 2 0 1.6 1.2 3 2.8 3.2-.2.4-.3.9-.3 1.4 0 2.8 2.3 5.1 5.1 5.1.3 0 .6 0 .8-.1.5.8 1.5 1.3 2.6 1.3 1.6 0 3-1.2 3.2-2.8.4.2.9.3 1.4.3 2.8 0 5.1-2.3 5.1-5.1 0-.5-.1-1-.3-1.5.5-.5.8-1.2.8-2 0-1.6-1.2-3-2.8-3.2z" />
                        </svg>
                    </div>
                    <h1>How can I help you today?</h1>
                    <p className="subtitle">Select a prompt template or start typing in the box below.</p>
                    <div className="suggestions-grid">
                        {suggestions.map((card, idx) => (
                            <div 
                                className="suggestion-card" 
                                key={idx} 
                                onClick={() => setPrompt(card.text)}
                            >
                                <div className="card-header">
                                    <span className="card-icon"><i className={card.icon}></i></span>
                                    <span className="card-title">{card.title}</span>
                                </div>
                                <p className="card-text">"{card.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="chats">
                {
                    displayChats?.map((chat, idx) => (
                        <div className={chat.role === 'user' ? 'chat-row user' : 'chat-row gpt'} key={idx}>
                            {chat.role === 'assistant' && (
                                <div className="avatar">
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                                        <path d="M21.3 12.8c.2-.5.3-1 .3-1.6 0-2.8-2.3-5.1-5.1-5.1-.3 0-.6 0-.8.1-.5-.8-1.5-1.3-2.6-1.3-1.6 0-3 1.2-3.2 2.8-.4-.2-.9-.3-1.4-.3-2.8 0-5.1 2.3-5.1 5.1 0 .5.1 1 .3 1.5-.5.5-.8 1.2-.8 2 0 1.6 1.2 3 2.8 3.2-.2.4-.3.9-.3 1.4 0 2.8 2.3 5.1 5.1 5.1.3 0 .6 0 .8-.1.5.8 1.5 1.3 2.6 1.3 1.6 0 3-1.2 3.2-2.8.4.2.9.3 1.4.3 2.8 0 5.1-2.3 5.1-5.1 0-.5-.1-1-.3-1.5.5-.5.8-1.2.8-2 0-1.6-1.2-3-2.8-3.2z" />
                                    </svg>
                                </div>
                            )}
                            <div className="message-content">
                                {chat.role === 'user' ? (
                                    <div className="userMessageBubble">
                                        <p className="userMessage">{chat.content}</p>
                                    </div>
                                ) : (
                                    <div className="gptMessage">
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                }

                {
                    hasTyping &&
                    <div className="chat-row gpt typing" key={"typing"}>
                        <div className="avatar">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.8" width="16" height="16">
                                <path d="M21.3 12.8c.2-.5.3-1 .3-1.6 0-2.8-2.3-5.1-5.1-5.1-.3 0-.6 0-.8.1-.5-.8-1.5-1.3-2.6-1.3-1.6 0-3 1.2-3.2 2.8-.4-.2-.9-.3-1.4-.3-2.8 0-5.1 2.3-5.1 5.1 0 .5.1 1 .3 1.5-.5.5-.8 1.2-.8 2 0 1.6 1.2 3 2.8 3.2-.2.4-.3.9-.3 1.4 0 2.8 2.3 5.1 5.1 5.1.3 0 .6 0 .8-.1.5.8 1.5 1.3 2.6 1.3 1.6 0 3-1.2 3.2-2.8.4.2.9.3 1.4.3 2.8 0 5.1-2.3 5.1-5.1 0-.5-.1-1-.3-1.5.5-.5.8-1.2.8-2 0-1.6-1.2-3-2.8-3.2z" />
                            </svg>
                        </div>
                        <div className="message-content">
                            <div className="gptMessage">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                <span className="typing-cursor">|</span>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export { Chat };