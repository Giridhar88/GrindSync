import {useNavigate} from "react-router-dom";
import React, {useState } from 'react';
import { useForm } from "react-hook-form";
import {nanoid} from "nanoid";

const Roomjoin = ({userSocket}) => {
    const [submitted, setsubmitted] = useState(false);
    const [createRoom, setcreateRoom] = useState(false);
    const [joinRoom, setJoinRoom] = useState(false);
    const [Roomid, setRoomid] = useState(null);
    const [userRequest, setuserRequest] = useState({name:'',roomid:'',isHost:false});
    const [isLoading, setisLoading] = useState(false);
   
   const navigate = useNavigate();
    
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => {
        setsubmitted(true)
        setuserRequest((prev)=>({...prev, name:data.name}))
    }
    const handleCreateRoom = () => {
        setcreateRoom(true)
        setisLoading(true)
        setJoinRoom(false)
        const roomId = nanoid(6)
        setRoomid(roomId)
        setuserRequest(prev=>({...prev, roomid:roomId}))
        const options = {
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify({data:{...userRequest, roomid:roomId, isHost:true},id:userSocket.current.id})
        }
        const url = 'http://127.0.0.1:3000/api/create-req'
        fetch(url, options).then((response)=>{
            response.json().then((responsedata)=>{
                if(responsedata.createstatus){
                    setisLoading(false)
                    userSocket.current.emit('register-user',{...userRequest, roomid:roomId, isHost:true})
                }
            })
        })
    }
    
    const handleCreateJoin = ()=>{
        navigate('/room')
    }
    const handleEnterRoom = () => {
        setisLoading(false)
        setJoinRoom(true)
        setcreateRoom(false)
    }
    const handleJoinRoom= ()=>{
        setisLoading(true)
        let data = getValues('roomid')
        console.log(data)
        setuserRequest((prev)=>({...prev, roomid:data}))
        const url = 'http://127.0.0.1:3000/api/join-req'
        const options = {
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify({data:{...userRequest, roomid:data},id:userSocket.current.id})
        }
        fetch(url, options).then(response=>{
            if(!response.ok){
                console.log('error from server side')
                setisLoading(false)
            }
            else{
                response.json().then((resdata)=>{
                if(resdata.roomstatus){
                    setisLoading(false)
                    userSocket.current.emit('join-user', data)
                    navigate('/room')
                }
                else{
                    setisLoading(false)
                    console.log('room doesnt exist')
                }
                })
            }
        })

    }
    return (
        <div>
            <form className='flex flex-col gap-2 justify-center items-center' onSubmit={handleSubmit(onSubmit)}>
                <input disabled={submitted}  className='input w-[20vw]' placeholder='User Name' {...register("name", { required: { value: true, message: 'This field is required' }, maxLength: { value: 20, message: 'Max Length is 20 characters' }, minLength: { value: 5, message: "Min Length is 5 characters" } })} />
                {errors.name && <div role="alert" className="w-[20vw] alert alert-error alert-soft">
                    <span>{errors.name.message}</span>
                </div>}
                {submitted?<input className='h-fit text-center my-1 w-fit  border-1 py-1 px-2 rounded-[5px] text-gray-500 border-gray-800' value='Submit' type="submit" />:<input className='h-fit text-center my-1 w-fit border-blue-300 border-1 py-1 px-2 rounded-[5px] hover:border-violet-300 cursor-pointer' value='Submit' type="submit" />}
                
                <div className='flex gap-2 items-center'>
                    <button onClick={() => handleCreateRoom()} disabled={!submitted} className='btn'>Create a Room</button>
                    <button onClick={() => {handleEnterRoom()}} disabled={!submitted} className='btn'>Enter a RoomId</button>
                </div>
                
                {(joinRoom && !createRoom) && <input className='input w-[20vw]' placeholder='Room ID' {...register("roomid")} />}
                {(joinRoom && !createRoom) && <button className='btn' onClick={()=>handleJoinRoom()}>Join</button>}
                {isLoading && <span className="loading loading-ring loading-lg"></span>}
                {(createRoom && !joinRoom && !isLoading) &&  <span className="px-4 py-2 w-fit m-3 border border-gray-300 rounded-lg text-sm font-mono shadow transition hover:shadow-violet-400/40 hover:scale-105">
                    {Roomid}
                </span>}
                {(createRoom && !joinRoom && !isLoading) && <button className='btn' onClick={()=>(handleCreateJoin())}>Join</button>}
            </form>
        </div>
    )
}

export default Roomjoin
