import React from 'react';

const Message = () => {
  return (
    <div className="flex items-center mb-4">
      <img
        className="rounded w-12 mr-4"
        src="https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
      />
      <div className="flex-1 text-left">
        Hey how is it going?
      </div>
    </div>
  );
};

export const ChatPanel = () => {
  return (
    <div className="relative bg-white p-8 h-full drop-shadow-md">
      <Message />
      <Message />
      <Message />
      <Message />
      <div className="flex absolute bottom-4">
        <input className="flex-1 border border-gray-400"></input>
        <button className="p-3 px-8 text-white bg-blue-500 hover:bg-blue-400">
          SEND
        </button>
      </div>
    </div>
  );
};
