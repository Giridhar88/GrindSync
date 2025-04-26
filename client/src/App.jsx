import {io} from 'socket.io-client'
import { useEffect, useRef} from "react";
import Timer from './components/Timer';
import Roomjoin from './components/Roomjoin';
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
const socketref = useRef(null)
useEffect(() => {
  socketref.current = io('http://localhost:3000')
  socketref.current.on('connect', ()=>{
    console.log(`connected to server with id ${socketref.current.id}` )
  })
  
  return () => {
    socketref.current.disconnect()
  }
}, [])


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Roomjoin userSocket={socketref}/>} />
      <Route path="/room/:roomid" element={<Timer/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
