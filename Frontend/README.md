# 🤖 Sigma GPT — ChatGPT Replica

A full-stack ChatGPT clone built from scratch, featuring a real-time chat interface, persistent conversation history, Markdown rendering with syntax highlighting, and a word-by-word typing animation — all powered by the OpenAI API.

---

## 📸 Project Overview

Sigma GPT replicates the core experience of ChatGPT:
- Start a new conversation or resume any previous one from the sidebar
- Messages are stored persistently in MongoDB and survive page refreshes
- AI responses are rendered in Markdown with code syntax highlighting
- A smooth typing animation simulates a live response being typed out

---

## 🗂️ Project Structure

```
gpt replica/
├── Frontend/                   # React + Vite client
│   ├── src/
│   │   ├── App.jsx             # Root component — sets up Context Provider & layout
│   │   ├── MyContext.jsx       # React Context definition (createContext)
│   │   ├── ChatWindow.jsx      # Handles user input, API calls, loading state
│   │   ├── Chat.jsx            # Renders chat messages + typing animation
│   │   ├── SideBar.jsx         # Thread history, new chat, thread switching
│   │   ├── index.css           # Global styles
│   │   ├── App.css             # App-level styles
│   │   ├── Chat.css            # Chat component styles
│   │   ├── ChatWindow.css      # ChatWindow component styles
│   │   ├── SideBar.css         # Sidebar component styles
│   │   └── main.jsx            # React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── Backend/                    # Node.js + Express server
    ├── server.js               # Express app setup, MongoDB connection
    ├── routes/
    │   └── chat.js             # All API route handlers
    ├── models/
    │   └── Thread.js           # Mongoose schema for threads & messages
    ├── utils/
    │   └── openai.js           # OpenAI API utility function
    ├── .env                    # Environment variables (not committed)
    └── package.json
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Component-based UI framework |
| **Vite** | Lightning-fast dev server & build tool |
| **HTML5 & CSS3** | Structure and styling |
| **JavaScript (ES6+)** | Core language |
| **React Context API** (`createContext`, `useContext`) | Global state management across components |
| **`useState`** | Local component state (prompt, reply, loading, threads, etc.) |
| **`useEffect`** | Side effects — auto-scroll, thread fetching, typing animation |
| **`react-markdown`** | Renders AI responses as formatted Markdown |
| **`rehype-highlight`** | Syntax highlighting for code blocks inside Markdown |
| **`highlight.js`** | Code highlighting engine (github-dark theme) |
| **`react-spinners`** (`ScaleLoader`) | Loading animation while waiting for AI response |
| **`uuid`** (`v1`) | Generates unique thread IDs for each new conversation |
| **Font Awesome** | Icons (send button, sidebar, avatars, suggestion cards) |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 5** | Web server and REST API framework |
| **MongoDB** | NoSQL database for persistent storage |
| **Mongoose** | ODM for MongoDB — schema definition and querying |
| **OpenAI API** (`gpt-4o-mini`) | AI language model for generating responses |
| **`dotenv`** | Loads environment variables from `.env` |
| **`cors`** | Enables cross-origin requests from the React frontend |
| **`nodemon`** | Auto-restarts server during development |

---

## ⚙️ How It Works

### 1. Global State with Context API
`MyContext.jsx` creates a React Context that is provided at the root `App.jsx` level. All components (`SideBar`, `ChatWindow`, `Chat`) consume this context with `useContext` to share state such as:
- `prompt` / `setPrompt` — the current user input
- `reply` / `setReply` — the latest AI response text
- `currThreadId` / `setCurrThreadId` — the active conversation's UUID
- `prevChats` / `setPrevChats` — message history for the current thread
- `newChat` / `setNewChat` — flag to show the landing dashboard
- `allThreads` / `setAllThreads` — list of all sidebar conversation threads

### 2. Sending a Message (`ChatWindow.jsx`)
When the user submits a prompt:
1. The user message is immediately appended to `prevChats` (optimistic UI).
2. A `POST /api/chat` request is sent to the backend with the message and `threadId`.
3. A `ScaleLoader` spinner is shown while waiting.
4. The AI response is stored in `reply` and also appended to `prevChats`.

### 3. Word-by-Word Typing Animation (`Chat.jsx`)
When a new `reply` arrives, a `useEffect` hook splits the response into individual words and reveals them one at a time via `setInterval` (every 40ms), simulating a live typing effect. A blinking cursor `|` is shown during this animation.

### 4. Sidebar & Thread Management (`SideBar.jsx`)
- On load and whenever `currThreadId` changes, a `GET /api/threads` request fetches all stored conversations and displays them in the history list.
- Clicking a thread loads its messages via `GET /api/threads/:threadId`.
- The "New Chat" button generates a fresh UUID and resets all state.

### 5. Backend & Database (`server.js`, `routes/chat.js`, `models/Thread.js`)
Each conversation is stored as a **Thread** document in MongoDB, containing:
- `threadId` — unique identifier (UUID from frontend)
- `title` — the first user message, used as the thread's display name
- `messages` — array of `{ role, content, timestamp }` objects
- `createdAt` / `updatedAt` — timestamps

The `/api/chat` route:
1. Finds or creates a Thread for the given `threadId`.
2. Saves the user's message to MongoDB immediately.
3. Calls the OpenAI API via `utils/openai.js`.
4. Saves the AI response and returns it to the frontend.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local instance or MongoDB Atlas)
- **OpenAI API Key**

---

### 1. Clone the Repository

```bash
git clone https://github.com/Nakshtra07/Sigma-GPT.git
cd "gpt replica"
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
MONGODB_URL=mongodb://localhost:27017/sigma-gpt
OPENAI_API_KEY=your_openai_api_key_here
```

Start the backend server:

```bash
# Development (with auto-restart)
npm run dev

# Production
nodemon server.js
```

> The backend runs on **http://localhost:8080**

---

### 3. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

> The frontend runs on **http://localhost:5173** (Vite default)

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chat` | Send a message, get an AI reply, persist to DB |
| `GET` | `/api/threads` | Get all conversation threads (sorted by latest) |
| `GET` | `/api/threads/:threadId` | Get all messages for a specific thread |
| `DELETE` | `/api/threads/:threadId` | Delete a specific thread |

---

## 🗃️ Database Schema

### Thread
```js
{
  threadId: String,       // Unique UUID
  title: String,          // First user message (used as thread name)
  messages: [
    {
      role: "user" | "assistant",
      content: String,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URL` | MongoDB connection URI |
| `OPENAI_API_KEY` | Your OpenAI secret API key |

---

## ✨ Key Features

- 💬 **Persistent Chat History** — all conversations saved in MongoDB
- 🧵 **Thread Management** — create new chats, switch between old ones via sidebar
- ⌨️ **Typing Animation** — word-by-word response reveal with blinking cursor
- 📝 **Markdown Rendering** — AI responses support bold, italics, lists, tables
- 🎨 **Code Highlighting** — fenced code blocks rendered with `github-dark` theme
- ⚡ **Loading Indicator** — animated spinner while fetching AI response
- 🔤 **Enter to Send** — keyboard shortcut support
- 💡 **Prompt Suggestions** — landing dashboard with clickable starter prompts
- 🛡️ **Error Handling** — graceful fallback if OpenAI API is unavailable

---

## 👤 Author

**Nakshatra**

---

## 📄 License

This project is for educational purposes.
