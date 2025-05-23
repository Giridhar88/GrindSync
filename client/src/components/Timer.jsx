import React, { useEffect, useState } from 'react';
// import {useNavigate} from "react-router-dom";
const Timer = ({userSocket}) => {
    const [seconds, setSeconds] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(25);
   const [members, setmembers] = useState([]);
   const [RoomId, setRoomId] = useState();
//    const navigate = useNavigate();
    //set seconds based on input value
    useEffect(() => {
        if (!isRunning) {
            setSeconds(time * 60)
        }
        
        
    }, [time, isRunning])
    //handle reload
    // useEffect(() => {
    //     const WasReloaded = performance.navigation.type ===1
    // }, [navigate]);
    useEffect(()=>{
        const socket = userSocket.current
        
        socket.on('update-members', ({roomid, users})=>{
            setRoomId(roomid)
            setmembers(users)
            socket.emit('update-received','')
        
    })
    setTimeout(() => {
        socket.emit('req-update', '')
    }, 50);
    },[])
    //handle timer using seconds state and isrunningg state
    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 0) {
                        setIsRunning(false)
                        return 0
                    }
                    else {
                        return s - 1
                    }
                })
            }, 1000);
        }
        return () => clearInterval(interval)
    }, [isRunning])

    const handleChange = (event) => {
        setTime(event.target.value)
        setSeconds(event.target.value * 60)
    }
    return (
        <div>
            <div>
                Members list {RoomId}
                {members.map((i,k)=>{
                    return <div key={k}>{i.name}</div>
                })}
            </div>
            <div className="flex flex-col gap-5 items-center justify-center">
                <div className="radial-progress"
                    style={{ "--value":(seconds/(time*60))*100, "--size": "12rem", "--thickness": "2px" } }
                    aria-valuenow={70} role="progressbar"><div>
                        <span className="countdown font-mono text-4xl">
                            <span style={{ "--value":Math.floor(seconds / 60)  }} aria-live="polite" aria-label={Math.floor(seconds / 60) }></span>
                        </span>
                        min
                        <span className="countdown font-mono text-4xl">
                            <span style={{ "--value": seconds % 60 } } aria-live="polite" aria-label={seconds % 60}></span>
                        </span>
                        sec
                    </div></div>
                <button className='btn' onClick={() => setIsRunning(!isRunning)}>{isRunning ? 'Reset' : 'Start'}</button>
            </div>

            <input type="range" min={0} max="90" value={time} onChange={(e) => handleChange(e)} className="range range-xs" />
            {time}
        </div>
    );
};

export default Timer;
