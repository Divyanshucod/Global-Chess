import React, { useState, useEffect } from 'react';

const Timer = ({ isActive, initialMinutes, initialSeconds, onTimeUpdate }:{isActive:boolean,initialMinutes:number,initialSeconds:number,onTimeUpdate:any}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    let timerInterval:any;

    if (isActive) {
      timerInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else {
          if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          } else {
            clearInterval(timerInterval);
          }
        }
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isActive, minutes, seconds]);

  useEffect(() => {
    onTimeUpdate(minutes, seconds);
  }, [minutes, seconds, onTimeUpdate]);

  return (
    <div className="p-4 bg-gray-800 text-white rounded-md shadow-lg">
      <h1 className="text-2xl font-mono">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </h1>
    </div>
  );
};

export default Timer;