const http = require('http')
const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors({ origin: 'http://localhost:5173' }));
const PORT = 3000
const path = require('path')
const server = http.createServer(app)
const {Server} = require('socket.io')
let room_info = {}
const io = new Server(server, {cors:{origin:'http://localhost:5173'}})

const storeUser = (e,room_info,sid)=>{
    const {name, roomid,isHost} = e
    if (room_info[roomid]) {
        room_info[roomid].push({ name: name, isHost ,socketId:sid});
    } else {
        room_info[roomid] = [{ name: name, isHost ,socketId:sid}];
    }
    console.log(room_info)
}

app.get('/', (req, res) => {
  res.json(room_info)
})
io.on('connection',(socket)=>{
    console.log(`a new client connected with id ${socket.id}`)
    socket.on('join-req',(msg)=>{
            let exists = room_info[msg.roomid]?true:false
            if(exists){
                socket.emit('room-status', exists)
                storeUser(msg,room_info,socket.id)
                console.log(room_info)
                socket.join(msg.roomid)
                socket.on('req-update', ()=>{
                    io.to(msg.roomid).emit('update-members',{roomid:msg.roomid, users:room_info[msg.roomid]})
                })
                return 0
            }
            else{
                socket.emit('room-status', exists)
                return 0
            }
    })
    socket.on('create-req',(msg)=>{
        console.log(msg)
        storeUser(msg,room_info, socket.id)
        socket.join(msg.roomid)
        setTimeout(() => {
            socket.emit('created-room',true)
        }, 0);
        socket.on('req-update', ()=>{
            console.log('reqsent....................................')
            io.to(msg.roomid).emit('update-members',{roomid:msg.roomid, users:room_info[msg.roomid]})
        })
    })
    socket.on('disconnect',()=>{
        let room = null;
        for (const key in room_info) {
            if(room_info[key]!=null){
            room_info[key] = room_info[key].filter((user)=>{
                if(user.socketId==socket.id){
                    room = key
                }
                return user.socketId != socket.id
            })}
            if(room_info[key].length==0){
                delete room_info[key]
            }
        }
        if(room && room_info[room]){
            let host = room_info[room].filter((user)=>{
                return user.isHost
            })
            if(host.length==0){
                room_info[room][0].isHost = true
        }
        
        }
        if(room){
            console.log(`someone disconnected in roomid ${room}`)
            io.to(room).emit('req-update', '')
        }
        console.log(room_info)
    })
    
})
server.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`)
})
