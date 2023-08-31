import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import useUserStore from '@/store/userStore';
import useBoardsStore from '@/store/boardsStore';
import { CreateBoardSteps, Metadata } from '@/interfaces/Board.d';

const BasicDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Metadata>();

  const [userData] = useUserStore((state) => [state.userData]);
  const [setBoardStep, setMetadata, metadata] = useBoardsStore((state) => [
    state.setBoardStep,
    state.setMetadata,
    state.metadata,
  ]);

  const onSubmit: SubmitHandler<Metadata> = async (data) => {
    setMetadata(data);
    setBoardStep(CreateBoardSteps.INVITE_USERS);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-6 space-y-4">
      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className={classNames(
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
            errors?.name ? 'border-red-500' : null
          )}
          type="text"
          defaultValue={metadata?.name || `${userData?.name}'s Board`}
          {...register('name', {
            required: 'Board name is required.',
          })}
        />
        <ErrorMessage
          errors={errors}
          name="name"
          render={({ message }) => (
            <p className="text-red-500 text-xs italic">{message}</p>
          )}
        />
      </div>

      <div>
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          className={classNames(
            'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline',
            errors?.description ? 'border-red-500' : null
          )}
          {...register('description', {
            maxLength: {
              value: 200,
              message: 'Description cannot be more than 200 characters.',
            },
          })}
          defaultValue={metadata?.description}
          placeholder="Enter a description for the Board (Optional)"
        />

        <ErrorMessage
          errors={errors}
          name="description"
          render={({ message }) => (
            <p className="text-red-500 text-xs italic">{message}</p>
          )}
        />
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <button type="submit" className="modalBtnNext">
          Next
        </button>
      </div>
    </form>
  );
};

export default BasicDetails;
