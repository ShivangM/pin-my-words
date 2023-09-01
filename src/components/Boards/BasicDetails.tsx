'use client';
import { useRef, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import useUserStore from '@/store/userStore';
import useBoardsStore from '@/store/boardsStore';
import { Metadata } from '@/interfaces/Board.d';
import Image from 'next/image';

const BasicDetails = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Metadata>();

  const [userData] = useUserStore((state) => [state.userData]);

  const [setMetadata, metadata, previewImage, setImage, closeCreateBoardModal] =
    useBoardsStore((state) => [
      state.setMetadata,
      state.metadata,
      state.previewImage,
      state.setImage,
      state.closeCreateBoardModal,
    ]);

  // Image Upload and Preview
  const imageRef = useRef<HTMLInputElement | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  const onSubmit: SubmitHandler<Metadata> = async (data) => {
    setMetadata(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pt-6 space-y-4">
      {/* Name  */}
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

      {/* Upload Image  */}
      <div className="">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Image (Optional)
        </label>

        <input hidden onChange={handleChange} ref={imageRef} type="file" />

        <Image
          src={previewImage || '/assets/board-placeholder.svg'}
          onClick={() => imageRef?.current?.click()}
          alt="Board Image"
          width={500}
          height={288}
          className="object-cover cursor-pointer object-center w-full rounded-md"
        />
      </div>

      {/* Description  */}
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

      {/* Submit  */}
      <div className="mt-4 flex items-center space-x-4">
        <button onClick={closeCreateBoardModal} className="modalBtnPrev">
          Cancel
        </button>

        <button disabled={isSubmitting} type="submit" className="modalBtnNext">
          Next
        </button>
      </div>
    </form>
  );
};

export default BasicDetails;
