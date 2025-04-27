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

io.on('connection',(socket)=>{
    console.log(`a new client connected with id ${socket.id}`)
    socket.on('join-req',(msg)=>console.log(msg))
    socket.on('create-req',(msg)=>console.log(msg))
})

server.listen(PORT,()=>{
    console.log(`server listening at port ${PORT}`)
})
