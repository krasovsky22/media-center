import { LockClosedIcon, MailIcon, UserIcon } from '@heroicons/react/outline';
import React, { useCallback, useState } from 'react';
import { DeepMap, FieldError, SubmitHandler, useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { Loading } from '@youtube-player/components';
import { useAuth } from '@youtube-player/auth';
import { CONFIRM_SIGN_UP } from '../../routes';

type FormInputsType = {
  username: string;
  password: string;
  verifyPassword: string;
  email: string;
  authentication: string;
};

const ErrorsContainer = ({
  errors,
}: {
  errors: DeepMap<FormInputsType, FieldError>;
}) => {
  const errorInputs = Object.keys(errors) as (keyof FormInputsType)[];

  return (
    <div
      role="alert"
      className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative text-sm"
    >
      {errorInputs.map((input) => (
        <li key={input}>{`${input !== 'authentication' ? input + ':' : ''} ${
          errors[input]?.message ?? ''
        }`}</li>
      ))}
    </div>
  );
};

const SignUpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const history = useHistory();

  const {
    clearErrors,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputsType>();

  const onSubmit: SubmitHandler<FormInputsType> = useCallback(async (data) => {
    setIsLoading(true);
    if (data.password !== data.verifyPassword) {
      setError('verifyPassword', {
        type: 'manual',
        message: "Passwords don't match",
      });
      setIsLoading(false);
      return;
    }

    try {
      await signUp(data.username, data.password, data.email);

      history.push(`${CONFIRM_SIGN_UP}?username=${data.username}`);
    } catch (e) {
      setError('authentication', { type: 'manual', message: e.message });
    }

    setIsLoading(false);
  }, []);

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
              <form
                className="flex flex-col gap-4"
                onSubmit={handleSubmit(onSubmit)}
              >
                {Object.keys(errors).length > 0 && (
                  <ErrorsContainer errors={errors} />
                )}
                <div className="text-center">
                  <h1 className="font-bold">Sign Up</h1>
                </div>
                <div className="flex relative">
                  <div className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm w-10">
                    <UserIcon />
                  </div>
                  <input
                    className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-yellow-300"
                    id="username"
                    placeholder="Username"
                    {...register('username', { required: true })}
                  ></input>
                </div>

                <div className="flex relative">
                  <div className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm w-10">
                    <MailIcon />
                  </div>
                  <input
                    className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-yellow-300"
                    id="email"
                    placeholder="Email"
                    {...register('email', {
                      required: true,
                      pattern: {
                        value:
                          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                        message: 'Invalid email address',
                      },
                    })}
                  ></input>
                </div>

                <div className="flex relative">
                  <div className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm w-10">
                    <LockClosedIcon />
                  </div>
                  <input
                    className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-yellow-300"
                    id="password"
                    type="password"
                    placeholder="Password"
                    {...register('password', {
                      required: true,
                      minLength: {
                        value: 8,
                        message: 'Min length is 8',
                      },
                    })}
                  ></input>
                </div>

                <div className="flex relative">
                  <div className="rounded-l-md inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm w-10">
                    <LockClosedIcon />
                  </div>
                  <input
                    className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent focus:bg-yellow-300"
                    id="verifyPassword"
                    type="password"
                    placeholder="Password"
                    {...register('verifyPassword', {
                      required: true,
                      minLength: {
                        value: 8,
                        message: 'Min length is 8',
                      },
                    })}
                  ></input>
                </div>

                <div className="flex flex-row-reverse place-content-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-blue-700 rounded"
                    onClick={() => clearErrors()}
                  >
                    Sign Up
                  </button>
                  <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 border-yellow-700 rounded">
                    <Link to="/">Back</Link>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
