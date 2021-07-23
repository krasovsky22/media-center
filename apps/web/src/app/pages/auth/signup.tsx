import { LockClosedIcon, UserIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { ReactComponent as Logo } from '../../../assets/logo.svg';
import { Loading } from '../../components';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormInputsType = {
  username: string;
  password: string;
  email: string;
};

const SignUpPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputsType>();
  const onSubmit: SubmitHandler<FormInputsType> = (data) => console.log(data);

  console.log('esad', errors);

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
                {/* {errors && (
                  <div
                    role="alert"
                    className="bg-red-100 border border-red-400 text-red-500 px-4 py-3 rounded relative text-sm"
                  >
                    <p>{errors}</p>
                  </div>
                )} */}
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
                {/* <div className="flex relative">
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
                </div> */}
                
                <div className="flex flex-row-reverse place-content-between">
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border-blue-700 rounded">
                    Sign Up
                  </button>
                  {/* <button
                    className="bg-red-300 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
                    onClick={signUpCallback}
                  >
                    Sign Up
                  </button> */}
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
