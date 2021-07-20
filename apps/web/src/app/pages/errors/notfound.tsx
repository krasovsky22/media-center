import React from 'react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="container mx-auto h-full min-h-screen flex flex-1 justify-center items-center px-5 relative ">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-400">404</h1>
        <h2 className="text-6xl font-medium">oops! Page not found</h2>
      </div>
    </div>
  );
};

export default NotFoundPage;
