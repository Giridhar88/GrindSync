import React, { useEffect, useState } from 'react';
// import {useNavigate} from "react-router-dom";
const Timer = ({ userSocket }) => {
    const [seconds, setSeconds] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(25);
    const [members, setmembers] = useState([]);
    const [RoomId, setRoomId] = useState();
    const [rest, setRest] = useState(5);
    const [isBreak, setisBreak] = useState(false);
    const [timeval, setTimeval] = useState(25);
    const [restval, setrestval] = useState(5);
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
    //handle room info 
    useEffect(() => {
        const socket = userSocket.current
        if(!userSocket.current){
            console.log('socket was never ready')
        }
        else{
            console.log('socket is ready', userSocket.current.id)
        }
        socket.on('update-members', ({ roomid, users }) => {
            setRoomId(roomid)
            setmembers(users)
            socket.emit('update-received', '')

        })
        setTimeout(() => {
            socket.emit('req-update', '')
        }, 50);
        socket.on('update-states',(states)=>{
            console.log("update for states recieved from the server")
            console.log(states)
            setisBreak(states.isBreak)
            setIsRunning(states.isRunning)
            setTime(states.time)
            setRest(states.rest)
            if(!states.isRunning && !states.isBreak){
                setSeconds(states.time*60)
            }
            else if(states.isBreak){
                setSeconds(states.rest*60)
            }
        })
    }, [])
    //handle timer using seconds state and isrunningg state
    useEffect(() => {
        let interval;
        // setSeconds(time*60)
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 0) {
                        setIsRunning(false)
                        setisBreak(true)
                        return 0
                    }
                    else {
                        return s - 1
                    }
                })
            }, 500);
        }
        return () => clearInterval(interval)
    }, [isRunning])
    useEffect(() => {
        // setSeconds(rest*60)
        
        let interval;
        if(isBreak){
            setSeconds(rest*60)
            interval = setInterval(() => {
                setSeconds((s)=>{
                    if(s <= 0){
                        setisBreak(false)
                        setIsRunning(true)
                        setSeconds(time*60)
                        return 0
                    }
                    else{
                        return s-1
                    }
                })
            }, 500);
        }
        return () => {
            clearInterval(interval)
        };
    }, [isBreak]);

    const handleChangetime = (event) => {
        setTimeval(event.target.value)   
    }
    const handleChangebreak = (event)=>{
        setrestval(event.target.value)
    }
    const updatetime = (e)=>{
        setTime(e.target.value)
    }
    const updaterest = (e)=>{
        setRest(e.target.value)
    }
    const handlestarttimer = ()=>{
        if(!isRunning && !isBreak){
            setIsRunning(true)
            setSeconds(time*60)
        }
        else{
            setIsRunning(false)
            setisBreak(false)
            setSeconds(time*60)
        }
    }
    useEffect(() => {
        if(userSocket.current){
            console.log('sent the states to server')
            userSocket.current.emit('timer-update',{
                isRunning:isRunning,
                isBreak:isBreak,    
                time:time,
                rest:rest,
                RoomId:RoomId,
            })
        }
    }, [time,isBreak,isRunning,rest]);
    return (
        <div>
            <div>
                Members list {RoomId}
                {members.map((i, k) => {
                    return <div key={k}>{i.name}</div>
                })}
            </div>
            <div className="flex flex-col gap-5 items-center justify-center">
                <div>
                    <span className={isRunning?'bg-green-600':'bg-red-600'}>isRunning</span>
                    <br />
                    <span className={isBreak?'bg-green-600':'bg-red-600'}>isBreak</span>
                </div>
                <div className="radial-progress"
                    style={{ "--value": (seconds / (time * 60)) * 100, "--size": "12rem", "--thickness": "2px" }}
                    aria-valuenow={70} role="progressbar"><div>
                        <span className="countdown font-mono text-4xl">
                            <span style={{ "--value": Math.floor(seconds / 60) }} aria-live="polite" aria-label={Math.floor(seconds / 60)}></span>
                        </span>
                        min
                        <span className="countdown font-mono text-4xl">
                            <span style={{ "--value": seconds % 60 }} aria-live="polite" aria-label={seconds % 60}></span>
                        </span>
                        sec
                    </div></div>
                <button className='btn' onClick={() => handlestarttimer()}>{(!isRunning && !isBreak)  ? 'Start' : 'Restart'}</button>
                <div>
                    <input type="range" min={0} max="90" value={timeval} onChange={(e) => handleChangetime(e)} onMouseUp={(e)=>updatetime(e)} className="range range-xs" />
                    {time}
                </div>
                <div className="w-full max-w-xs">
                    <span className='text-sm text-gray-500'>
                    set break time 
                    </span>
                    <input  type="range" min={0} max={20} value={restval} onChange={(e)=> handleChangebreak(e)} onMouseUp={(e)=>updaterest(e)} className="range " step="5" />
                    <div className="flex justify-between px-2.5 mt-2 text-xs ">
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                    </div>
                    <div className="flex justify-between px-2.5 mt-2 text-xs ">
                        <span>0</span>
                        <span>5</span>
                        <span>10</span>
                        <span>15</span>
                        <span>20</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Timer;
