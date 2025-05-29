import React, { useEffect, useRef, useState } from 'react';

const Message = ({ roomid, socket }) => {
  const [message, setMessage] = useState('');
  const [messageSet, setMessageSet] = useState([]);
  const bottomref = useRef()

  useEffect(() => {
    const handler = (msg) => {
      setMessageSet((p) => [...p, { message: msg, others: true }]);
    };
  
    socket.current.on('sent-message', handler);
  
    return () => {
      socket.current.off('sent-message', handler); // ❗ remove listener
    };
  }, []);
  

  useEffect(() => {
    bottomref.current?.scrollIntoView({behavior:'smooth'})    
  }, [messageSet]);

  const sendMessage = () => {
    setMessageSet((p) => [...p, { message: message, others: false }])
    console.table(messageSet)
    socket.current.emit('user-message', { message: message, roomid: roomid })
    
  }
  
  const handleMessage = (event) => {
    setMessage(event.target.value)
  }
  return (
    <div className="p-2 md:h-[80vh] mt-12">
      <div className="h-[90%] overflow-scroll space-y-2">
        {messageSet.map((item, key) => (
          <div key={key} className={`chat ${item.others?"chat-start":"chat-end"} w-[90%]`}>
            <div className="chat-image avatar" />
            <div className="chat-bubble text-sm">{item.message}</div>
          </div>
        )
        )}
        <div ref = {bottomref}/>
      </div>

      <div className='flex justify-center items-center gap-2'><input
        onKeyDown={(e)=>{
          if(e.key === 'Enter'){
            sendMessage()
          }
        }}
        type="text"
        value={message}
        onChange={(e) => handleMessage(e)}
        placeholder="Type here"
        className="input input-bordered mt-2 w-full"
      />
        <button className='bg-black rounded-full' onClick={() => sendMessage()}><svg xmlns="http://www.w3.org/2000/svg" className='m-2' height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" /></svg>
        </button>
      </div>

    </div>
  );
};

export default Message;



