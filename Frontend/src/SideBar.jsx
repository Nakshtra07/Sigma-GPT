import './SideBar.css';
import { useContext, useEffect } from 'react';
import {MyContext} from './MyContext.jsx';
import {v1 as uuidv1} from 'uuid';

function SideBar() {

    const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async() => {
        try {
            const response = await fetch("http://localhost:8080/api/threads");
            const res = await response.json();
            const filteredData = res.map(thread =>({threadId : thread.threadId, title: thread.title}));
            //threadId, title
            console.log(filteredData);
            setAllThreads(filteredData);
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        getAllThreads();
    },[currThreadId]);

    const handleSelectThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/threads/${threadId}`);
            const messages = await response.json();
            setPrevChats(messages);
            setCurrThreadId(threadId);
            setNewChat(false);
            setReply(null); // So typing animation doesn't run for historical messages
        } catch (error) {
            console.error("Failed to load thread messages:", error);
        }
    };

    const createNewChat =  ()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    return (
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="Alogo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>

            {/* history */}
            <ul className="history">
                {
                    allThreads?.map((thread,idx)=>(
                        <li 
                            key={idx} 
                            onClick={() => handleSelectThread(thread.threadId)}
                            className={thread.threadId === currThreadId ? 'active' : ''}
                        >
                            <i className="fa-regular fa-comment"></i>
                            <span>{thread.title}</span>
                        </li>
                    ))
                }
            </ul>

            {/* sign */}
            <div className="sign">
                By Nakshatra
            </div>
        </section>
    )
}

export { SideBar };