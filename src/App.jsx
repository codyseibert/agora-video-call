import React, { useState } from 'react';
import './App.css';
import { VideoRoom } from './components/VideoRoom';

function App() {
  const [joined, setJoined] = useState(false);

  const joinRoom = async () => {
    setJoined(true);
  };

  return (
    <div className="App">
      <h1>WDJ Virtual Call</h1>

      {!joined && (
        <button onClick={joinRoom}>Join Room</button>
      )}
      {joined && (
        <VideoRoom leaveRoom={() => setJoined(false)} />
      )}
    </div>
  );
}

export default App;
