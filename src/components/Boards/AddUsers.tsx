import { BoardAccess } from '@/interfaces/Board.d';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { IoIosCloseCircle } from 'react-icons/io';
import useUserStore from '@/store/userStore';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { User } from '@/interfaces/User';
import debounce from 'lodash.debounce';
import fetchUsersByEmailSearch from '@/lib/Users/fetchUsersByEmailSearch';
import { OptionProps } from 'react-select';
import Image from 'next/image';
import useAddUsersStore from '@/store/addUsersStore';

const AddUsers = () => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<{
    user: User;
    access: BoardAccess;
  }>();

  const [userData] = useUserStore((state) => [state.userData]);
  const [users, addUser, removeUser] = useAddUsersStore((state) => [
    state.users,
    state.addUser,
    state.removeUser,
  ]);

  const onSubmit: SubmitHandler<{
    user: User;
    access: BoardAccess;
  }> = (data) => {
    addUser({ ...data.user, access: data.access });
    reset();
  };

  const promiseOptions = (
    inputValue: string,
    callback: (res: User[]) => void
  ) => {
    try {
      fetchUsersByEmailSearch(inputValue).then((res) => {
        callback(res);
      });
    } catch (error) {
      // Todo: Handle error
    }
  };

  const loadOptions = debounce(promiseOptions, 1000);

  const accessOptions = [
    { value: BoardAccess.READ_ONLY, label: 'Read Only' },
    { value: BoardAccess.READ_WRITE, label: 'Read & Write' },
    { value: BoardAccess.ADMIN, label: 'Admin' },
  ];

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap w-full items-center gap-4">
        {users
          ? users.map((user, index) => (
              <div
                key={index}
                className="flex bg-gray-50 rounded-full p-1.5 items-center gap-2"
              >
                <div className="flex space-x-2 items-center">
                  <Image
                    src={user.image || '/images/user.png'}
                    alt={user.name}
                    className="rounded-full"
                    height={30}
                    width={30}
                  />

                  <div className="text-xs">
                    <p className="text-gray-900 font-medium">{user.name}</p>
                    <p className="text-gray-500">{user.access}</p>
                  </div>
                </div>
                <button
                  className=""
                  onClick={() => {
                    removeUser(user.uid!);
                  }}
                >
                  <IoIosCloseCircle className="h-5 w-5 text-red-500" />
                </button>
              </div>
            ))
          : null}
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
                if (users?.find((u) => u.uid === value.uid)) {
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
                  Option: ({
                    data,
                    innerProps,
                    innerRef,
                  }: OptionProps<User>) => {
                    return (
                      <div
                        className="cursor-pointer"
                        ref={innerRef}
                        {...innerProps}
                      >
                        <div className="flex py-2 px-4 items-center space-x-2">
                          <Image
                            src={data.image || '/images/user.png'}
                            alt={data.name}
                            className="rounded-full"
                            height={30}
                            width={30}
                          />
                          <div className="text-sm">
                            <p className="text-gray-900 font-medium">
                              {data.name}
                            </p>
                            <p className="text-gray-500">{data.email}</p>
                          </div>
                        </div>
                      </div>
                    );
                  },
                }}
                noOptionsMessage={(user) =>
                  `No user found with this email ${user.inputValue}`
                }
                onChange={(val) => onChange(val)}
                className="flex-1"
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
              menuPlacement="top"
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
  );
};

export default AddUsers;
