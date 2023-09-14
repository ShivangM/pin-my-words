import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ImageUploadState {
    image: File | undefined;
    previewImage: string | undefined;
    setImage: (image: File) => void;
    setPreviewImage: (previewImage: string | undefined) => void;
    reset: () => void;
}

const initialState = {
    image: undefined,
    previewImage: undefined,
}

const useImageUploadStore = create<ImageUploadState>()(
    devtools((set, get) => ({
        ...initialState,

        setImage: (image) => set({ image, previewImage: URL.createObjectURL(image) }),
        setPreviewImage: (previewImage) => set({ previewImage }),

        reset: () => {
            set(initialState);
        }
    }))
);

export default useImageUploadStore;
