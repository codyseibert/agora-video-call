import React, {
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

export const VideoPlayer = ({ user }) => {
  const ref = useRef();

  useEffect(() => {
    user.videoTrack.play(ref.current);
  }, []);

  return (
    <div
      className="bg-white p-5 h-full drop-shadow-md"
      ref={ref}
    ></div>
  );
};
