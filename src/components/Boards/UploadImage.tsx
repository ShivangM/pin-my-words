import { CreateBoardSteps } from '@/interfaces/Board.d';
import useBoardsStore from '@/store/boardsStore';
import useUserStore from '@/store/userStore';
import Image from 'next/image';
import React, { useRef } from 'react';

type Props = {};

const UploadImage = (props: Props) => {
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [setImage, previewImage, createBoard, setBoardStep, loading] =
    useBoardsStore((state) => [
      state.setImage,
      state.previewImage,
      state.createBoard,
      state.setBoardStep,
      state.loading,
    ]);

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

      <div className="mt-4 flex items-center space-x-4">
        <button
          type="button"
          onClick={() => {
            setBoardStep(CreateBoardSteps.INVITE_USERS);
          }}
          className="modalBtnPrev"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={() => createBoard(userData!)}
          disabled={loading}
          className="modalBtnNext"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default UploadImage;
