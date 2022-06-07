import React, { useEffect, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { AgoraPlayer } from './AgoraPlayer';

const APP_ID = '99ee7677a8a745ed94b7f7f03fdab53e';
const TOKEN =
  '00699ee7677a8a745ed94b7f7f03fdab53eIAB/DkaTRVsLCUXIAcRMsx6HRhK2JJWjVVd3qiKcoWF3fyKBCQIAAAAAEACKRNzQfpCgYgEAAQCrkqBi';
const CHANNEL = 'wdj';

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});
AgoraRTC.setLogLevel(4);

export const VideoRoom = ({ leaveRoom }) => {
  const [myUid, setMyUid] = useState(null);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  useEffect(() => {
    const handleUserJoined = async (user, mediaType) => {
      await client.subscribe(user, mediaType);

      if (mediaType === 'video') {
        setUsers((previousUsers) => {
          return [...previousUsers, user];
        });
      }
      if (mediaType === 'audio') {
        // user.audioTrack.play();
      }
    };

    const handleUserLeft = (user) => {
      setUsers((previousUsers) =>
        previousUsers.filter(({ uid }) => uid !== user.uid)
      );
    };

    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) => {
        setMyUid(uid);
        return Promise.all([
          AgoraRTC.createMicrophoneAndCameraTracks(),
          uid,
        ]);
      })
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
        setLocalTracks(tracks);
        setUsers((previousUsers) => {
          return [...previousUsers, { videoTrack, uid }];
        });
        return client.publish([audioTrack, videoTrack]);
      });

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off('user-published', handleUserJoined);
      client.off('user-left', handleUserLeft);
      setUsers([]);
      setMyUid(null);
      client.unpublish(localTracks).then(() => {
        client.leave();
      });
    };
  }, []);

  const getColumnCount = () => {
    if (users.length <= 1) {
      return 1;
    } else if (users.length <= 4) {
      return 2;
    } else if (users.length <= 9) {
      return 3;
    } else {
      return 4;
    }
  };

  return (
    <div>
      <h3>My UID: {myUid}</h3>
      <button onClick={leaveRoom}>Leave Room</button>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${getColumnCount()}, 200px)`,
          }}
        >
          {users.map((user) => (
            <AgoraPlayer key={user.uid} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};
