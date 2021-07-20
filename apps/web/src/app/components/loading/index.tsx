import React from 'react';
import RingLoader from 'react-spinners/RingLoader';

const Loading: React.FC = () => {
  return (
    <div className="m-auto">
      <RingLoader />
    </div>
  );
};

export default Loading;
