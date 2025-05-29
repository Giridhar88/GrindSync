import React, { useEffect, useState } from 'react';
import Message from './Message';

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

    useEffect(() => {
        if (!isRunning) {
            setSeconds(time * 60)}
        
    }, [time, isRunning])

    useEffect(() => {
        const socket = userSocket.current
        if (!userSocket.current) {
            console.log('socket was never ready')
        }
        else {
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
        socket.on('update-states', (states) => {
            console.log("update for states recieved from the server")
            console.log(states)
            setisBreak(states.isBreak)
            setIsRunning(states.isRunning)
            setTime(states.time)
            setRest(states.rest)
            setrestval(states.restval)
            setTimeval(states.timeval)
            if (!states.isRunning && !states.isBreak) {
                setSeconds(states.time * 60)
            }
            else if (states.isBreak) {
                setSeconds(states.rest * 60)
            }
        })
    }, [])

    useEffect(() => {
        let interval;
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
            }, 1000);
        }
        return () => clearInterval(interval)
    }, [isRunning])

    useEffect(() => {
        let interval;
        if (isBreak) {
            setSeconds(rest * 60)
            interval = setInterval(() => {
                setSeconds((s) => {
                    if (s <= 0) {
                        setisBreak(false)
                        setIsRunning(true)
                        setSeconds(time * 60)
                        return 0
                    }
                    else {
                        return s - 1
                    }
                })
            }, 1000);
        }
        return () => {
            clearInterval(interval)
        };
    }, [isBreak]);

    const handleChangetime = (event) => {
        setTimeval(event.target.value)
    }
    const handleChangebreak = (event) => {
        setrestval(event.target.value)
    }
    const updatetime = (e) => {
        setTime(e.target.value)
    }
    const updaterest = (e) => {
        setRest(e.target.value)
    }
    const handlestarttimer = () => {
        if (!isRunning && !isBreak) {
            setIsRunning(true)
            setSeconds(time * 60)
        }
        else {
            setIsRunning(false)
            setisBreak(false)
            setSeconds(time * 60)
        }
    }
    useEffect(() => {
        if (userSocket.current) {
            console.log('sent the states to server')
            userSocket.current.emit('timer-update', {
                isRunning: isRunning,
                isBreak: isBreak,
                time: time,
                rest: rest,
                RoomId: RoomId,
                timeval:timeval,
                restval:restval,
            })
        }
    }, [time, isBreak, isRunning, rest,timeval,restval]);

    return (
        <div className="min-h-screen bg-black flex flex-col lg:flex-row gap-4 p-4 md:p-6">
            {/* Members List */}
            <div className="w-full lg:w-1/4 bg-gray-900 rounded-md p-4 order-2 lg:order-1">
                <h3 className="text-lg font-medium text-gray-200 mb-3">Room: {RoomId}</h3>
                <div className="space-y-2 max-h-[40vh] lg:max-h-[70vh] overflow-y-auto">
                    {members.map((i, k) => (
                        <div key={k} className="text-gray-400">{i.name}</div>
                    ))}
                </div>
            </div>

            {/* Timer Controls */}
            <div className="w-full lg:w-2/4 flex flex-col items-center justify-center bg-gray-900 rounded-md p-6 order-1 lg:order-2">
                <div className="flex gap-4 mb-4">
                    <span className={`px-2 py-1 rounded text-sm ${isRunning ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                        isRunning
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${isBreak ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                        isBreak
                    </span>
                    <span>rest:{rest},restval:{restval},time:{time},timeval:{timeval}</span>
                </div>

                <div 
                    className="radial-progress text-gray-300" 
                    style={{ "--value": (seconds / (time * 60)) * 100, "--size": "12rem", "--thickness": "2px" }} 
                    aria-valuenow={(seconds / (time * 60)) * 100} 
                    role="progressbar"
                >
                    <div>
                        <span className="countdown font-mono text-4xl text-gray-200">
                            <span style={{ "--value": Math.floor(seconds / 60) }} aria-live="polite" aria-label={Math.floor(seconds / 60)}></span>
                        </span>
                        <span className="text-gray-400">min</span>
                        <span className="countdown font-mono text-4xl text-gray-200">
                            <span style={{ "--value": seconds % 60 }} aria-live="polite" aria-label={seconds % 60}></span>
                        </span>
                        <span className="text-gray-400">sec</span>
                    </div>
                </div>

                <button 
                    className="btn bg-gray-800 hover:bg-gray-700 text-gray-200 px-6 py-2 rounded mt-6"
                    onClick={handlestarttimer}
                >
                    {(!isRunning && !isBreak) ? 'Start' : 'Restart'}
                </button>

                <div className="w-full max-w-md space-y-6 mt-6">
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Work Duration</label>
                        <input 
                            disabled={isRunning}
                            type="range" 
                            min={0} 
                            max="90" 
                            value={timeval} 
                            onChange={handleChangetime} 
                            onMouseUp={updatetime} 
                            className="range range-xs range-accent w-full"
                        />
                        <div className="text-center mt-2 text-gray-400">{time} min</div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Break Duration</label>
                        <input 
                            type="range" 
                            min={0} 
                            max="20" 
                            value={restval} 
                            onChange={handleChangebreak} 
                            onMouseUp={updaterest} 
                            className="range range-xs range-accent w-full" 
                            step="5" 
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>0</span>
                            <span>5</span>
                            <span>10</span>
                            <span>15</span>
                            <span>20</span>
                        </div>
                    </div>
                </div>
            </div>

            
            <div className="w-full lg:w-1/4 bg-gray-900 rounded-md p-4 order-3">
                {userSocket && <Message  roomid={RoomId} socket={userSocket} />}
            </div>
        </div>
    );
};

export default Timer;