import {useNavigate} from "react-router-dom";
import React, {useState } from 'react';
import { useForm } from "react-hook-form";
import {nanoid} from "nanoid";
import MouseGlow from "./MouseGlow";

const Roomjoin = ({backendURL, userSocket}) => {
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
        const url = `${backendURL}/api/create-req`
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
        const url = `${backendURL}/api/join-req`
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
        
        <div className="min-h-screen w-full flex flex-col md:flex-row justify-center items-center bg-neutral-950 bg-[radial-gradient(ellipse_at_top,_rgba(124,58,237,0.2),_transparent)] px-4 py-12">
  {/* FORM SECTION */}
  <MouseGlow/>
  <form
    className="backdrop-blur-3xl bg-black/40 relative z-5 border border-white/10 shadow-2xl rounded-2xl p-8 w-full max-w-md flex flex-col gap-5"
    onSubmit={handleSubmit(onSubmit)}
  >
    <h2 className="text-2xl font-semibold text-white text-center">Join GrindSync</h2>

    <input
      disabled={submitted}
      className="w-full px-4 py-2 bg-black/50 border border-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
      placeholder="User Name"
      {...register("name", {
        required: { value: true, message: "This field is required" },
        maxLength: { value: 20, message: "Max Length is 20 characters" },
        minLength: { value: 5, message: "Min Length is 5 characters" },
      })}
    />
    {errors.name && (
      <div className="text-sm text-red-400 bg-red-900/20 px-3 py-1 rounded-md">
        {errors.name.message}
      </div>
    )}

    <input
      type="submit"
      value="Submit"
      className={`w-full py-2 rounded-md font-medium transition ${
        submitted
          ? "bg-gray-800 text-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-violet-600 to-indigo-500 text-white hover:shadow-lg hover:scale-105"
      }`}
    />

    <div className="flex justify-between gap-3">
      <button
        onClick={() => handleCreateRoom()}
        disabled={!submitted}
        className="w-1/2 py-2 cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-violet-600 text-white disabled:opacity-50 hover:scale-105 transition"
      >
        Create Room
      </button>
      <button
        onClick={() => handleEnterRoom()}
        disabled={!submitted}
        className="w-1/2 py-2 cursor-pointer rounded-md bg-gradient-to-r from-teal-600 to-cyan-500 text-white disabled:opacity-50 hover:scale-105 transition"
      >
        Enter Room
      </button>
    </div>

    {joinRoom && !createRoom && (
      <>
        <input
          className="w-full px-4 py-2 bg-black/50 border border-gray-700 text-white rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Room ID"
          {...register("roomid")}
        />
        <button
          className="w-full py-2 cursor-pointer mt-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 transition"
          onClick={() => handleJoinRoom()}
        >
          Join
        </button>
      </>
    )}

    {isLoading && <span className="loading loading-ring loading-lg mx-auto" />}

    {createRoom && !joinRoom && !isLoading && (
      <>
        <span className="text-white text-sm font-mono px-4 py-2 bg-black/50 border border-gray-700 rounded-md text-center">
          {Roomid}
        </span>
        <button
          className="w-full py-2 cursor-pointer mt-2 rounded-md bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:scale-105 transition"
          onClick={() => handleCreateJoin()}
        >
          Join Created Room
        </button>
      </>
    )}
  </form>

  {/* RIGHT SECTION */}
  <div className="text-center md:ml-12 mt-10 md:mt-0">
    <h1 className="text-5xl p-2 mb-2 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-teal-300 hover:from-purple-500 hover:to-blue-300 transition-all">
      GrindSync
    </h1>
    <p className="mt-4 text-lg text-gray-300">A collaborative Pomodoro timer</p>
    <p className="text-sm text-gray-500 mt-1">Work together. Stay focused.</p>
  </div>
</div>

    )
}

export default Roomjoin
