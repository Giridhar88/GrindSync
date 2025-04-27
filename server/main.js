const http = require('http')
const cors = require('cors')
const express = require('express')
const app = express()
app.use(cors({ origin: 'http://localhost:5173' }));
const PORT = 3000
const path = require('path')
const server = http.createServer(app)
const {Server} = require('socket.io')

const io = new Server(server, {cors:{origin:'http://localhost:5173'}})
let userinfo = []
io.on('connection',(socket)=>{
    console.log(`a new client connected with id ${socket.id}`)
    socket.on('join-req',(msg)=>{
        
            let exists = userinfo.find(element=>element.roomid===msg.roomid)
            if(exists){
                userinfo.push(msg)
                socket.emit('room-status', exists)
                socket.join('roomid')
                return 0
            }
            else{
                socket.emit('room-status', exists)
                return 0
            }
        
        console.log(userinfo)
    })
    socket.on('create-req',(msg)=>{
        console.log(msg)
        userinfo.push(msg)
        setTimeout(() => {
            socket.emit('created-room',true)
        }, 2000);
    })
    
})

server.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`)
})
