# ⏱️ GrindSync

**GrindSync** is a real-time collaborative Pomodoro timer app built with **React**, **Express**, and **Socket.IO**. It allows multiple users to join a shared session, stay in sync during focus periods, chat, and take breaks together.

---

**Live Demo:** [grind-sync.vercel.app](https://grind-sync.vercel.app/)


## 🚀 Features

- 🔗 **Room-Based Collaboration**  
  Create or join a room using a unique Room ID and sync timers with friends or teammates.

- 🧑‍🤝‍🧑 **Real-Time Member Updates**  
  See a live list of members in the room. Updates occur automatically when users join or leave.

- ⏲️ **Customizable Pomodoro Timer**  
  Adjustable focus duration with a smooth UI. Break timer support in progress.

- 📡 **WebSocket Powered**  
  Uses `Socket.IO` for real-time communication between clients and server.

- 💬 **Planned Chat Feature**  
  Built-in chat support coming soon to enhance collaboration during sessions.

---

## 🛠️ Tech Stack

| Frontend | Backend | Real-Time |
|----------|---------|------------|
| React + Vite | Node.js + Express | Socket.IO |

---

## 🧩 Project Structure

```
├── client/             # React frontend
│   ├──src
|   |   ├──components
|   |   ├──...
|   |---...
├── server/             # Express + Socket.IO backend
│   ├── main.js
│   └── ...
├── README.md
```

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Giridhar88/GrindSync.git
cd GrindSync
```

### 2. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 3. Run the App

```bash
# In one terminal (backend)
cd server
node main.js

# In another terminal (frontend)
cd client
npm run dev
```

### 4. Setup env variables
*create an env file in client folder (GrindSync/client/.env) and copy paste the contents* 
```
VITE_BACKEND_URL=http://localhost:3000
```
*create an env file in the server folder (GrindSync/server/.env)  and copy paste the contents* 
```
PORT=3000
CLIENT_ORIGIN=https://localhost:5173
```
---

## 🌐 Usage

1. Enter your name.
2. Create a room or enter an existing Room ID.
3. Join the room and wait for others.
4. Start the timer — everyone stays in sync.
5. Chat during the break time using the built in chat

---


## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open source and free to use under the MIT License.