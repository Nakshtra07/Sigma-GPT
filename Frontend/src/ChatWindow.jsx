import './ChatWindow.css';
import { Chat } from './Chat.jsx'
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat } = useContext(MyContext);
    const [loading, Setloading] = useState(false);

    let getReply = async () => {
        if (!prompt.trim()) return;

        const userMessage = prompt;
        setPrompt("");
        setNewChat(false);
        setPrevChats(prev => [...prev, { role: "user", content: userMessage }]);
        Setloading(true);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: userMessage,
                threadId: currThreadId
            })
        };
        try {
            const response = await fetch("http://localhost:8080/api/chat", options);
            const data = await response.json();
            if (data.reply) {
                setReply(data.reply);
                setPrevChats(prev => [...prev, { role: "assistant", content: data.reply }]);
            } else {
                const errMsg = data.error || "Something went wrong. Please try again.";
                setReply(errMsg);
                setPrevChats(prev => [...prev, { role: "assistant", content: errMsg }]);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            const errMsg = "Failed to connect to server. Please check your connection.";
            setReply(errMsg);
            setPrevChats(prev => [...prev, { role: "assistant", content: errMsg }]);
        }
        Setloading(false);
    };

    // Auto-scroll to bottom of chat container
    useEffect(() => {
        const chatsContainer = document.querySelector(".chats");
        if (chatsContainer) {
            chatsContainer.scrollTop = chatsContainer.scrollHeight;
        }
    }, [prevChats, reply]);

    return (
        <div className="chatWindow">
            <div className="navbar">
                <span>Sigma GPT &nbsp; <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv">
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>

            <Chat></Chat>
            <ScaleLoader color="#fff" loading={loading}></ScaleLoader>
            <div className="chatInput">
                <div className="inputBox">
                    <input placeholder="Ask anything" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}>
                    </input>
                    <div id="submit" onClick={getReply}><i className="fa-solid fa-arrow-up"></i></div>
                </div>
                <p className="info">ChatGPT can make mistakes. Check important info.</p>
            </div>
        </div>
    )
}

export { ChatWindow };