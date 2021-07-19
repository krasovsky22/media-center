import React, { useState, useCallback, useMemo } from 'react';
import { ReactComponent as Logo } from '../../assets/logo.svg';
import { UserIcon, LockClosedIcon } from '@heroicons/react/outline';
import { useAuth } from '../context/auth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();

  const handleLogin = useCallback(
    (event) => {
      event.preventDefault();

      login(username, password);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [username, password]
  );

  return (
    <div className="container mx-auto h-full min-h-screen flex flex-1 justify-center items-center px-5">
      <div className="w-full max-w-lg">
        <div className="leading-loose">
          <div className="grid laptop:grid-cols-2 phone:grid-cols-1 phone:grid-flow-col items-center gap-5 ">
            <div className="hidden laptop:block">
              <Logo />
            </div>
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div className="flex relative">
                <div className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm w-10">
                  <UserIcon />
                </div>
                <input
                  className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-yellow-300"
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                ></input>
              </div>
              <div className="flex relative">
                <div className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm w-10">
                  <LockClosedIcon />
                </div>
                <input
                  className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-yellow-300"
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                ></input>
              </div>
              <div>
                <button>Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
