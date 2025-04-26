import React, { useEffect, useState } from 'react';

const Timer = () => {
    const [seconds, setSeconds] = useState(10);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setSeconds((sec) => {
                    if (sec <= 1) {
                        clearInterval(interval);
                        setIsRunning(false);
                        return 0;
                    }
                    return sec - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);


    return (
        <div>
            <span className="countdown font-mono text-6xl">
                <span style={{ "--value": seconds } /* as React.CSSProperties */} aria-live="polite" aria-label={seconds}></span>
            </span>
            <button className='btn' onClick={() => setIsRunning(true)}>Start</button>
        </div>
    );
};

export default Timer;
