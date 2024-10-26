import React, { useState, useEffect } from "react";

function App() {
    const [currentTime, setCurrentTime] = useState(0);
    useEffect(() => {
        fetch("http://127.0.0.1:5000/time")
            .then((res) => res.json())
            .then((data) => {
                setCurrentTime(data.time);
                console.log(data.time);
            });
    }, []);
    return <div>Fetched current time from API: {currentTime}</div>;
}

export default App;
