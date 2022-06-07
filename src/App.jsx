import { useState } from 'react';
import './App.css';
import { VideoRoom } from './components/VideoRoom';

function App() {
  const [joined, setJoined] = useState(false);
  return (
    <div className="App">
      <h1>WDJ Virtual Call</h1>

      {!joined && (
        <button onClick={() => setJoined(true)}>
          Join Room
        </button>
      )}

      {joined && <VideoRoom />}
    </div>
  );
}

export default App;
