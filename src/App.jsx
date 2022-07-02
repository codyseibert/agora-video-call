import { useState } from 'react';
import './App.css';
import { VideoRoom } from './components/VideoRoom';

function App() {
  const [joined, setJoined] = useState(false);

  return (
    <div className="h-full p-8 mb-12">
      {!joined && (
        <>
          <h1 className="text-center text-5xl">
            Codemegle
          </h1>

          <button onClick={() => setJoined(true)}>
            Join Room
          </button>
        </>
      )}

      {joined && (
        <>
          <div className="flex justify-center mb-8">
            <button
              className="p-4 px-8 bg-red-500 hover:bg-red-400 text-white mr-8"
              onClick={() => setJoined(false)}
            >
              Leave
            </button>
            <h1 className="text-center text-5xl">
              Codemegle
            </h1>

            <button
              className="p-4 px-8 bg-blue-500 hover:bg-blue-400 text-white ml-8"
              onClick={() => setJoined(false)}
            >
              Next {'>'}
            </button>
          </div>

          <div className="text-center h-full">
            <VideoRoom />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
