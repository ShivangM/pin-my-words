'use client';
import { BoardAccess, BoardUser } from '@/interfaces/Board.d';
import { User } from '@/interfaces/User';
import fetchUsersByEmailSearch from '@/lib/Users/fetchUsersByEmailSearch';
import useBoardStore from '@/store/boardStore';
import useUIStore from '@/store/uiStore';
import useUserStore from '@/store/userStore';
import { Dialog, Transition } from '@headlessui/react';
import { ErrorMessage } from '@hookform/error-message';
import debounce from 'lodash.debounce';
import Image from 'next/image';
import { Fragment } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { OptionProps } from 'react-select';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { toast } from 'react-toastify';
type Props = {};

const AddUserModal = (props: Props) => {
  const [addUser] = useBoardStore((state) => [state.addUser]);
  const [addUserModalOpen, toggleAddUserModal] = useUIStore((state) => [
    state.addUserModalOpen,
    state.toggleAddUserModal,
  ]);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<{
    user: User;
    access: BoardAccess;
  }>();

  const userData = useUserStore((state) => state.userData);

  const handleAddUser: SubmitHandler<{
    user: User;
    access: BoardAccess;
  }> = async (data) => {
    toast.loading('Adding user to board...', {
      toastId: 'add-user',
    });

    const boardUser: BoardUser = {
      ...data.user,
      access: data.access,
    };

    try {
      await addUser(boardUser, userData!);
      toast.success('User added successfully!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      toggleAddUserModal();
      reset();
      toast.dismiss('add-user');
    }
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
      //To-Do: Handle error
    }
  };

  const loadOptions = debounce(promiseOptions, 1000);

  const accessOptions = [
    { value: BoardAccess.READ_ONLY, label: 'Read Only' },
    { value: BoardAccess.READ_WRITE, label: 'Read & Write' },
    { value: BoardAccess.ADMIN, label: 'Admin' },
  ];

  return (
    <>
      <Transition show={addUserModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={toggleAddUserModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 space-y-6 text-left align-middle shadow-xl transition-all">
                  <div className="">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Add User
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Add user to this board
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(handleAddUser)}>
                    <div>
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="description"
                      >
                        Select User
                      </label>

                      <div className="">
                        <div className="mb-3">
                          <Controller
                            control={control}
                            name="user"
                            rules={{
                              required: 'Email is required.',
                              pattern: {
                                value:
                                  /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: 'Please enter a valid email address.',
                              },
                              validate: (value) => {
                                if (value?.uid === userData?.uid) {
                                  return 'You cannot invite yourself.';
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
                                            src={
                                              data.image || '/images/user.png'
                                            }
                                            alt={data.name}
                                            className="rounded-full"
                                            height={30}
                                            width={30}
                                          />
                                          <div className="text-sm">
                                            <p className="text-gray-900 font-medium">
                                              {data.name}
                                            </p>
                                            <p className="text-gray-500">
                                              {data.email}
                                            </p>
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
                        </div>

                        <ErrorMessage
                          errors={errors}
                          name="user"
                          render={({ message }) => (
                            <p className="text-red-500 text-xs italic">
                              {message}
                            </p>
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
                            <p className="text-red-500 text-xs italic">
                              {message}
                            </p>
                          )}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-4">
                      <button
                        onClick={toggleAddUserModal}
                        className="modalBtnPrev"
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="modalBtnNext"
                        disabled={isSubmitting}
                      >
                        Add User
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AddUserModal;
