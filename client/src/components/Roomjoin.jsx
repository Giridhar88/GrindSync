
import React, { useState } from 'react'

import { useForm } from "react-hook-form"
import {nanoid} from "nanoid";
const Roomjoin = ({userSocket}) => {
    const [submitted, setsubmitted] = useState(false);
    const [createRoom, setcreateRoom] = useState(false);
    const [joinRoom, setJoinRoom] = useState(false);
    const [roomid, setRoomid] = useState(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        setsubmitted(true)
        console.log(data)
    }
    const handleCreateRoom = () => {
        setcreateRoom(true)
        const roomid = nanoid(6)
        setRoomid(roomid)
    }
    const handleJoinRoom = () => {
        userSocket.current.emit('join-req','trial-msg-sentjoinreq')
        setJoinRoom(true)
    }
    return (
        <div>
            <form className='flex flex-col gap-2 justify-center items-center' onSubmit={handleSubmit(onSubmit)}>
                <input className='input w-[20vw]' placeholder='User Name' {...register("name", { required: { value: true, message: 'This field is required' }, maxLength: { value: 20, message: 'Max Length is 20 characters' }, minLength: { value: 5, message: "Min Length is 5 characters" } })} />
                {errors.name && <div role="alert" className="w-[20vw] alert alert-error alert-soft">
                    <span>{errors.name.message}</span>
                </div>}
                <input className='h-fit text-center my-1 w-fit border-blue-300 border-1 py-1 px-2 rounded-[5px] hover:border-violet-300 cursor-pointer' value='Submit' type="submit" />
                <div className='flex gap-2 items-center'>
                    <button onClick={() => handleCreateRoom()} disabled={!submitted} className='btn'>Create a Room</button>
                    <button onClick={() => { handleJoinRoom() }} disabled={!submitted} className='btn'>Join a Room</button>
                </div>
                <input hidden={!joinRoom} className='input w-[20vw]' placeholder='Room ID' {...register("roomid")} />
                <span hidden={!createRoom} className="px-4 py-2 w-fit m-3 border border-gray-300 rounded-lg text-sm font-mono shadow transition hover:shadow-violet-400/40 hover:scale-105">
                    {roomid}
                </span>
                
            </form>
        </div>
    )
}

export default Roomjoin
