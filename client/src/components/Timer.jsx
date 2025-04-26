import React, { useEffect, useState } from 'react';

const Timer = () => {
    const [seconds, setSeconds] = useState(10);
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(25);
    const [timeFormatted, setTimeFormatted] = useState({});


    //set seconds based on input value
    useEffect(() => {
        if (!isRunning) {
            setSeconds(time * 60)
        }
    }, [time, isRunning])


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


    //handle formatted time
    useEffect(() => {

        setTimeFormatted(() => {
            return {
                min: Math.floor(seconds / 60),
                sec: seconds % 60,
            }
        })

    }, [seconds]);
    const handleChange = (event) => {
        setTime(event.target.value)
        setSeconds(event.target.value * 60)
    }
    return (
        <div>
            <div className="flex flex-col gap-5 items-center justify-center">
                <div className="radial-progress"
                    style={{ "--value":(seconds/(time*60))*100, "--size": "12rem", "--thickness": "2px" } /* as React.CSSProperties */}
                    aria-valuenow={70} role="progressbar"><div>
                        <span className="countdown font-mono text-4xl">
                            <span style={{ "--value": timeFormatted.min }} aria-live="polite" aria-label={timeFormatted.min}>24</span>
                        </span>
                        min

                        <span className="countdown font-mono text-4xl">
                            <span style={{ "--value": timeFormatted.sec } /* as React.CSSProperties */} aria-live="polite" aria-label={timeFormatted.sec}>59</span>
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
