import React, { useEffect, useState } from 'react';
import AgoraRTC, { createClient } from 'agora-rtc-sdk-ng';
import { VideoPlayer } from './VideoPlayer';

const APP_ID = '99ee7677a8a745ed94b7f7f03fdab53e';
const TOKEN =
  '00699ee7677a8a745ed94b7f7f03fdab53eIAApoyMoTzk7vs7z6VZss24GSras+N37TeYdwlj7EDi9qSKBCQIAAAAAEACKRNzQfi6hYgEAAQCsMKFi';
const CHANNEL = 'wdj';

const client = createClient({
  mode: 'rtc',
  codec: 'vp8',
});
AgoraRTC.setLogLevel(4);

let agoraCommandQueue = Promise.resolve();

export const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const waitForConnectionState = (connectionState) => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          if (client.connectionState === connectionState) {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });
    };

    const handleUserJoined = async (user, mediaType) => {
      try {
        await client.subscribe(user, mediaType);

        if (mediaType === 'video') {
          setUsers((previousUsers) => {
            if (
              previousUsers.some((u) => u.uid === user.uid)
            ) {
              return previousUsers;
            }
            return [...previousUsers, user];
          });
        }

        if (mediaType === 'audio') {
          // user.audioTrack.play()
        }
      } catch (err) {
        console.log(
          'the user probably left the channel before you got this join event'
        );
      }
    };

    const handleUserLeft = async (user) => {
      try {
        await client.unsubscribe(user);
      } catch (err) {
        console.log(
          'the user probably left the channel before you got this join event'
        );
      }
      setUsers((previousUsers) =>
        previousUsers.filter((u) => u.uid !== user.uid)
      );
    };

    const connect = async () => {
      await waitForConnectionState('DISCONNECTED');

      client.on('user-published', handleUserJoined);
      client.on('user-left', handleUserLeft);

      const uid = await client.join(
        APP_ID,
        CHANNEL,
        TOKEN,
        null
      );

      setUid(uid);

      const tracks =
        await AgoraRTC.createMicrophoneAndCameraTracks();
      const [audioTrack, videoTrack] = tracks;
      setUsers((previousUsers) => [
        ...previousUsers,
        {
          uid,
          videoTrack,
          audioTrack,
        },
      ]);
      await client.publish(tracks);
      return tracks;
    };

    const cleanup = async (localTracks) => {
      await waitForConnectionState('CONNECTED');
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      setUsers(() => []);
      client.off('user-published', handleUserJoined);
      client.off('user-left', handleUserLeft);
      await client.unpublish(localTracks);
      await client.leave();
    };

    agoraCommandQueue = agoraCommandQueue.then(connect);

    return () => {
      agoraCommandQueue = agoraCommandQueue.then(cleanup);
    };
  }, []);

  return (
    <>
      {uid}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 200px)',
          }}
        >
          {users.map((user) => (
            <VideoPlayer key={user.uid} user={user} />
          ))}
        </div>
      </div>
    </>
  );
};
