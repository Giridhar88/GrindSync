import React, { useEffect, useState } from 'react'

const MouseGlow = () => {

    const [position, setPosition] = useState({x:0 , y:0});
    useEffect(() => {
        const handleMove = (e)=>{
            setPosition({x:e.clientX, y:e.clientY})
        }
        window.addEventListener('mousemove', handleMove);
      return () => {
        window.removeEventListener('mousemove', handleMove);
      }
    }, [])
    
    
    return (
        <div
        className="pointer-events-none fixed top-0 left-0 z-1 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl transition-transform duration-200 ease-out"
        style={{
          transform: `translate(${position.x - 96}px, ${position.y - 96}px)`,
        }}
      ></div>
  )
}

export default MouseGlow
 
