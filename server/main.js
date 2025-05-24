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
app.use(express.json());
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
app.post('/api/join-req',(req,res)=>{
    console.log("This is from POST REQ")
    console.log(req.body)
    const msg = req.body
    const roomid = req.body.data.roomid
    console.log(roomid)
    let exists = room_info[roomid]?true:false
    console.log(exists)
    if(exists){
        storeUser(msg.data,room_info,msg.id)
        res.status(200).send({roomstatus:true})
    }
    else{
        res.status(401).send({roomstatus:false})
    }
})
app.post('/api/create-req',(req,res)=>{
    console.log('This is from create req POST')
    console.log(req.body.data)
    res.status(200).send({createstatus:true})
})
io.on('connection',(socket)=>{
    console.log(`a new client connected with id ${socket.id}`)
    socket.on('register-user',(msg)=>{
        storeUser(msg,room_info, socket.id)
        socket.join(msg.roomid)
        console.log(`Socket ${socket.id} joined rooms:`, Array.from(socket.rooms));
        socket.on('req-update', ()=>{
            
            io.to(msg.roomid).emit('update-members',{roomid:msg.roomid, users:room_info[msg.roomid]})
        })
    })
    socket.on('join-user',(msg)=>{
        socket.join(msg)
        socket.on('req-update',()=>{
            io.to(msg).emit('update-members',{roomid:msg, users:room_info[msg]})
        })
    })

    socket.on('timer-update',(msg)=>{
        console.log(`Emitting update-states to room: ${msg.RoomId}`);
        console.log(`Socket ${socket.id} is in rooms:`, Array.from(socket.rooms));
        console.log('recieved state update req')
        console.log(msg)
        console.log(msg.RoomId)
        io.to(msg.RoomId).emit('update-states',{isRunning:msg.isRunning,
            isBreak:msg.isBreak,
            time:msg.time,
            rest:msg.rest,})
    })

    //update room info on disconnect
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
            io.to(room).emit('update-members', {roomid:room, users:room_info[room]})
        }
        console.log(room_info)
    })
    
})
server.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`)
})
