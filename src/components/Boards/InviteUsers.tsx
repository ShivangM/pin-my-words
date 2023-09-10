import {
  BoardAccess,
  CollaborativeUser,
  CreateBoardSteps,
} from '@/interfaces/Board.d';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import useBoardsStore from '@/store/boardsStore';
import { IoIosCloseCircle } from 'react-icons/io';
import useUserStore from '@/store/userStore';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { User } from '@/interfaces/User';
import debounce from 'lodash.debounce';
import fetchUsersByEmailSearch from '@/lib/fetchUsersByEmailSearch';
import { OptionProps } from 'react-select';
import Image from 'next/image';
import { toast } from 'react-toastify';

const InviteUsers = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CollaborativeUser>();

  const [addUser, removeUser, users, setBoardStep, createBoard] =
    useBoardsStore((state) => [
      state.addUser,
      state.removeUser,
      state.users,
      state.setBoardStep,
      state.createBoard,
    ]);

  const [userData] = useUserStore((state) => [state.userData]);
  const [loading, setLoading] = useState(false)

  const onSubmit: SubmitHandler<CollaborativeUser> = (data) => {
    addUser(data);
  };

  const promiseOptions = (inputValue: string, callback: (res: User[]) => void) => {
    fetchUsersByEmailSearch(inputValue).then((res) => {
      callback(res);
    });
  };

  const loadOptions = debounce(promiseOptions, 1000);

  const accessOptions = [
    { value: BoardAccess.READ_ONLY, label: 'Read Only' },
    { value: BoardAccess.READ_WRITE, label: 'Read & Write' },
    { value: BoardAccess.ADMIN, label: 'Admin' },
  ];

  const handleCreateBoard = async () => {
    setLoading(true)
    toast.loading('Creating board...', {
      toastId: 'creating-board',
    });

    try {
      await createBoard(userData!)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
      toast.dismiss('creating-board');
    }
  }

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
          className="flex flex-wrap w-full items-center gap-4"
        >
          {users ? users.map((user, index) => (
            <div
              key={index}
              className="flex bg-gray-50 rounded-full p-1.5 items-center gap-2"
            >
              <div className="flex space-x-2 items-center">
                <Image
                  src={user.user.image || '/images/user.png'}
                  alt={user.user.name}
                  className="rounded-full"
                  height={30}
                  width={30}
                />

                <div className="text-xs">
                  <p className="text-gray-900 font-medium">{user.user.name}</p>
                  <p className="text-gray-500">{user.access}</p>
                </div>
              </div>
              <button
                className=""
                onClick={() => {
                  removeUser(user.user.uid!);
                }}
              >
                <IoIosCloseCircle className="h-5 w-5 text-red-500" />
              </button>
            </div>
          ))
            : null
          }
        </div>

        <div className="">
          <div className="flex items-center space-x-2 mb-3">
            <Controller
              control={control}
              name="user"
              rules={{
                required: 'Email is required.',
                pattern: {
                  value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                  message: 'Please enter a valid email address.',
                },
                validate: (value) => {
                  if (value?.uid === userData?.uid) {
                    return 'You cannot invite yourself.';
                  }
                  if (users?.find((u) => u.user.uid === value.uid)) {
                    return 'User already added.';
                  }
                },
              }}

              render={({ field: { onChange, ref } }) => (
                <AsyncSelect
                  //@ts-ignore
                  inputRef={ref}
                  cacheOptions
                  placeholder="Enter email address"
                  loadOptions={loadOptions}
                  getOptionLabel={(user) => user.email}
                  components={{
                    Option: ({ data, innerProps, innerRef }: OptionProps<User>) => {
                      return (
                        <div className='cursor-pointer' ref={innerRef} {...innerProps}>
                          <div className="flex py-2 px-4 items-center space-x-2">
                            <Image
                              src={data.image || '/images/user.png'}
                              alt={data.name}
                              className="rounded-full"
                              height={30}
                              width={30}
                            />
                            <div className="text-sm">
                              <p className='text-gray-900 font-medium'>{data.name}</p>
                              <p className='text-gray-500'>{data.email}</p>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  }}

                  noOptionsMessage={(user) => `No user found with this email ${user.inputValue}`}
                  onChange={(val) => onChange(val)}
                  className='flex-1'
                />
              )}
            />

            <button type="submit" className="modalBtnNext">
              +
            </button>
          </div>

          <ErrorMessage
            errors={errors}
            name="user"
            render={({ message }) => (
              <p className="text-red-500 text-xs italic">{message}</p>
            )}
          />
        </div>

        <div className="">
          <Controller
            control={control}
            name="access"
            rules={{ required: 'Access is required.' }}
            defaultValue={BoardAccess.READ_ONLY}
            render={({ field: { onChange, ref } }) => (
              <Select
                //@ts-ignore
                inputRef={ref}
                defaultValue={accessOptions[0]}
                onChange={(val) => onChange(val?.value)}
                options={accessOptions}
                isSearchable={false}
                menuPlacement='top'
              />
            )}
          />

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
          disabled={loading}
          onClick={() => {
            setBoardStep(CreateBoardSteps.ENTER_DETAILS);
          }}
          className="modalBtnPrev"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={handleCreateBoard}
          className="modalBtnNext"
        >
          Create Board
        </button>
      </div>
    </div>
  );
};

export default InviteUsers;
