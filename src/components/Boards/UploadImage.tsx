import { CreateBoardSteps } from '@/interfaces/Board.d';
import useBoardsStore from '@/store/boardsStore';
import useUserStore from '@/store/userStore';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

type Props = {};

const UploadImage = (props: Props) => {
  const imageRef = useRef<HTMLInputElement>();
  const [setImage, previewImage, createBoard, setBoardStep] = useBoardsStore(
    (state) => [
      state.setImage,
      state.previewImage,
      state.createBoard,
      state.setBoardStep,
    ]
  );

  const [userData] = useUserStore((state) => [state.userData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="mb-4 pt-6">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="image"
      >
        Image
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

      <div className="mt-4 flex items-center space-x-4">
        <button
          type="button"
          onClick={() => {
            setBoardStep(CreateBoardSteps.INVITE_USERS);
          }}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => createBoard(userData)}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
