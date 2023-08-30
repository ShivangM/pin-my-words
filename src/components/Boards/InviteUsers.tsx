import {
  BoardAccess,
  CollaborativeUser,
  CreateBoardSteps,
} from '@/interfaces/Board.d';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames';
import { ErrorMessage } from '@hookform/error-message';
import useBoardsStore from '@/store/boardsStore';
import { IoIosCloseCircle } from 'react-icons/io';
import useUserStore from '@/store/userStore';

const InviteUsers = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CollaborativeUser>();

  const [addUser, removeUser, users, setBoardStep] = useBoardsStore((state) => [
    state.addUser,
    state.removeUser,
    state.users,
    state.setBoardStep,
  ]);

  const [userData] = useUserStore((state) => [state.userData]);

  const onSubmit: SubmitHandler<CollaborativeUser> = (data) => {
    addUser(data);
  };

  return (
    <div className="pt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <form className="space-y-4">
        <label
          className="block text-gray-700 text-sm font-bold"
          htmlFor="description"
        >
          Users
        </label>

        <div
          hidden={users.length === 0}
          className="flex flex-wrap w-full items-center gap-4"
        >
          {users?.map((user, index) => (
            <div
              key={index}
              className="flex bg-gray-50 rounded-full px-4 py-2 items-center gap-2"
            >
              <p className="text-sm text-gray-500">{user.email}</p>
              <button
                className=""
                onClick={() => {
                  removeUser(user.email);
                }}
              >
                <IoIosCloseCircle className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))}
        </div>

        <div className="">
          <div className="flex items-center space-x-2 mb-3">
            <input
              className={classNames(
                'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline',
                errors?.email ? 'border-red-500' : null
              )}
              type="text"
              {...register('email', {
                required: 'Email is required.',
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: 'Please enter a valid email address.',
                },
                validate: (value) => {
                  if (value === userData?.email) {
                    return 'You cannot invite yourself.';
                  }
                  if (users.find((u) => u.email === value)) {
                    return 'User already added.';
                  }
                },
              })}
              placeholder="Enter other users email for the Board (Optional)"
            />

            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              +
            </button>
          </div>

          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) => (
              <p className="text-red-500 text-xs italic">{message}</p>
            )}
          />
        </div>

        <div className="">
          <select
            className={classNames(
              'shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
              errors?.access ? 'border-red-500' : null
            )}
            {...register('access', {
              required: 'Access is required.',
            })}
            defaultValue={BoardAccess.READ_ONLY}
          >
            <option value={BoardAccess.READ_ONLY}>
              Read Only (Only Read the Words)
            </option>
            <option value={BoardAccess.READ_WRITE}>
              Read & Write (Read & Write the Words)
            </option>
            <option value={BoardAccess.ADMIN}>
              Admin ( Read, Write, Update and Delete the words. )
            </option>
          </select>

          <ErrorMessage
            errors={errors}
            name="access"
            render={({ message }) => (
              <p className="text-red-500 text-xs italic">{message}</p>
            )}
          />
        </div>
      </form>

      <div className="mt-4 flex items-center space-x-4">
        <button
          type="button"
          onClick={() => {
            setBoardStep(CreateBoardSteps.ENTER_DETAILS);
          }}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => {
            setBoardStep(CreateBoardSteps.SELECT_THUMBNAIL);
          }}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InviteUsers;
