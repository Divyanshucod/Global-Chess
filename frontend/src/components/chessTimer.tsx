import React, { useState, useEffect } from 'react';



const ChessTimer = ({ player, isActive, initialMinutes, initialSeconds, onTimeUpdate,socket}:{player:string,isActive:Boolean,initialMinutes:number,initialSeconds:number,onTimeUpdate:any,socket:WebSocket}) => {
  const [time, setTime] = useState({ minutes: initialMinutes, seconds: initialSeconds });

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setTime(prevTime => {
          const newSeconds = prevTime.seconds > 0 ? prevTime.seconds - 1 : 59;
          const newMinutes = prevTime.seconds > 0 ? prevTime.minutes : prevTime.minutes - 1;
          return {
            minutes: newMinutes,
            seconds: newSeconds,
          };
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  useEffect(() => {
    onTimeUpdate(player, time);
  }, [time, player, onTimeUpdate]);

  return (
    <div className={`px-2 py-3  ${player === 'white' ? 'bg-gray-200 text-black' : ' bg-gray-200 text-black'} rounded-md shadow-lg flex items-center h-full justify-center`}>
      <img src='stopWatchT.png' width='25px' className='mix-blend-normal'/>
      <p className="text-small font-mono">
        {time.minutes}:{time.seconds < 10 ? `0${time.seconds}` : time.seconds}
      </p>
    </div>
  );
};

export default ChessTimer;
