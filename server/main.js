const http = require('http')
const cors = require('cors')
const express = require('express')
const app = express()
require('dotenv').config();
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "https://grind-sync.vercel.app";
app.use(cors({ origin: CLIENT_ORIGIN }));
const PORT = 3000
const path = require('path')
const server = http.createServer(app)
const {Server} = require('socket.io');

const io = new Server(server, {cors:{origin:CLIENT_ORIGIN}})
app.use(express.json());

let room_info = {}
let roomStates = {}

const storeUser = (e,room_info,sid)=>{
    const {name, roomid,isHost} = e
    if (room_info[roomid]) {
        room_info[roomid].push({ name: name, isHost ,socketId:sid});
    } else {
        room_info[roomid] = [{ name: name, isHost ,socketId:sid}];
    }
    console.log(room_info)
}

app.get('/get', (req, res) => {
  res.json(roomStates)
})
app.post('/api/join-req',(req,res)=>{
    
   
    const msg = req.body
    const roomid = req.body.data.roomid
   
    let exists = room_info[roomid]?true:false
    
    if(exists){
        storeUser(msg.data,room_info,msg.id)
        res.status(200).send({roomstatus:true})
    }
    else{
        res.status(401).send({roomstatus:false})
    }
})
app.post('/api/create-req',(req,res)=>{
    
    roomStates[req.body.data.roomid] = {
        isRunning: false,
        isBreak: false,
        time: 25,
        rest: 5,
        timeval: 25,
        restval: 5,
        timerStartTime:Date.now(),
        lastUpdateTime:Date.now()
      }
    res.status(200).send({createstatus:true})
})

const getCurrentRemainingSeconds = (roomId)=>{
    const state = roomStates[roomId]
    if(!state){
        return 0
    }
    const now = Date.now()
    const elapsed = Math.floor((now-state.timerStartTime)/1000)
    if(state.isRunning && !state.isBreak){
        const totalWorkSeconds = state.time*60
        return Math.max(0, totalWorkSeconds-elapsed);
    }
    else if(!state.isRunning && state.isBreak){
        const totalBreakSeconds = state.rest*60
        return Math.max(0,totalBreakSeconds-elapsed)
    }
    return state.time*60
}

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
    socket.on('init-states', (rid,callback)=>{
        console.log('init states called')
        console.log(roomStates[rid])
        let state = roomStates[rid]
        if(state){
            const remainingSeconds = getCurrentRemainingSeconds(rid)
            const responseState = {
                ...state,
                remainingSeconds: remainingSeconds,
                serverTime:Date.now()
            }
            callback(responseState)
        }
        else{
            console.log('no state was found ')
            callback(null)
        }
    })
    socket.on('timer-update',(msg)=>{
        console.log(`Emitting update-states to room: ${msg.RoomId}`);
       const currentTime = Date.now()
        const currentState = roomStates[msg.RoomId]

        let newState = {isRunning:msg.isRunning,
            isBreak:msg.isBreak,
            time:msg.time,
            rest:msg.rest,
            timeval:msg.timeval,
            restval:msg.restval,
            lastUpdateTime:currentTime
        }
        if(msg.isRunning && (!currentState || !currentState.isRunning)){
            newState.timerStartTime = currentTime
            console.log('timer starting at', currentTime)
        } else if(msg.isBreak && (!currentState || !currentState.isBreak)){
            newState.timerStartTime = currentTime
            console.log('break starting at', currentTime)
        } else if(!msg.isRunning && !msg.isBreak){
            newState.timerStartTime = currentState.timerStartTime
        }
        roomStates[msg.RoomId] = newState;
        const remainingSeconds = getCurrentRemainingSeconds(msg.RoomId)
        console.log(`emiting updates to room ${msg.RoomId}`)
        const statesToEmit = {
            ...newState,
            remainingSeconds:remainingSeconds,
            serverTime:currentTime,
        }
        io.to(msg.RoomId).emit('update-states',statesToEmit)
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
    socket.on('user-message',(msg)=>{
       
        socket.to(msg.roomid).emit('sent-message',msg.message)
    })
})
server.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`)
})
