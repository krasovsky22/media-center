import { LockClosedIcon, UserIcon } from '@heroicons/react/outline';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Link, Redirect, useLocation } from 'react-router-dom';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { Loading } from '../../components';
import { useAuth } from '../../context/auth';
import { ROUTE_PLAYER, SIGN_UP } from '../../routes';
import { LocationState } from './commongTypes';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const usernameInput = useRef<HTMLInputElement>(null);

  const { isInitializing, login, isLoggedIn, google } = useAuth();
  const location = useLocation<LocationState>();

  useEffect(() => {
    usernameInput.current?.focus();
  }, []);

  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      try {
        await login(username, password);

        // generate google access token
        const url = google?.generateAuthUrl();

        if (url) {
          window.location.href = url;
        }
      } catch (e) {
        console.error('cannot login', e);
        setError(e.message);
      }

      setIsLoading(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [username, password]
  );

  if (isInitializing) {
    return (
      <div className="flex h-screen">
        <Loading />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <Redirect
        to={{
          pathname: ROUTE_PLAYER,
          state: { from: location },
        }}
      />
    );
  }

  return (
    <>
      {isLoading && <Loading />}
      <div className="container mx-auto h-full min-h-screen flex flex-1 justify-center items-center px-5 relative">
        <div className="w-full max-w-lg">
          <div className="leading-loose">
            <div className="grid laptop:grid-cols-2 phone:grid-cols-1 phone:grid-flow-col items-center gap-5 ">
              <div className="hidden laptop:block">
                <Logo />
              </div>
              <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                {error && (
                  <div
                    role="alert"
                    className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative text-sm"
                  >
                    <p>{error}</p>
                  </div>
                )}
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
                    ref={usernameInput}
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
                <div className="flex flex-row-reverse place-content-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-blue-700 rounded"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                  <Link to={SIGN_UP}>
                    <button className="bg-red-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
                      Sign Up
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
