import {io} from 'socket.io-client'
import {useState, useEffect, useRef} from "react";
import Timer from './components/Timer';
import './App.css'


function App() {
const socketref = useRef(null)
useEffect(() => {
  socketref.current = io('http://localhost:3000')
  socketref.current.on('connect', ()=>{
    console.log('connected to server and comm through sockets')
  })
  
  return () => {
    socketref.current.disconnect()
  }
}, [])


  return (
    <>
    <div className='flex items-center justify-center h-[100vh] w-[100vw]'>
      <Timer/>
    </div>
    </>
  )
}

export default App
