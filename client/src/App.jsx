import {io} from 'socket.io-client'
import { useEffect, useRef} from "react";
import Timer from './components/Timer';
import Roomjoin from './components/Roomjoin';
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";


function App() {
  const backendURL = import.meta.env.VITE_BACKEND_URL
  const socketref = useRef(null)
useEffect(() => {
  socketref.current = io(backendURL)
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
      <Route path="/" element={<Roomjoin backendURL={backendURL} userSocket={socketref}/>} />
      <Route path="/room" element={<Timer userSocket={socketref}/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App
