import React from 'react';
import RingLoader from 'react-spinners/RingLoader';

const Loading: React.FC = () => {
  return (
    <div className="container max-w-full absolute bg-gray-300 bg-opacity-75 flex justify-center align-middle items-center h-full z-10 top-0 left-0">
      <div className="mx-auto flex flex-col">
        <RingLoader />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
