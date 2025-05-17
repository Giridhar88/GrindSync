# ⏱️ GrindSync

**GrindSync** is a real-time collaborative Pomodoro timer app built with **React**, **Express**, and **Socket.IO**. It allows multiple users to join a shared session, stay in sync during focus periods, chat, and take breaks together.

---

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
│   ├── components/
│   └── pages/
├── server/             # Express + Socket.IO backend
│   ├── index.js
│   └── ...
├── README.md
```

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/GrindSync.git
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
node index.js

# In another terminal (frontend)
cd client
npm run dev
```

---

## 🌐 Usage

1. Enter your name.
2. Create a room or enter an existing Room ID.
3. Join the room and wait for others.
4. Start the timer — everyone stays in sync.
5. Use upcoming chat and break features for a full Pomodoro experience.

---

## 📌 Future Improvements

- [x] Break timer support with adjustable durations
- [ ] Integrated chat with Socket.IO
- [ ] Timer control permissions (e.g., host-only start/pause)
- [ ] Persistent rooms with reconnect logic
- [ ] Mobile responsiveness and UI polish

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you would like to change.

---

## 📄 License

This project is open source and free to use under the MIT License.