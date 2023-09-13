import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ImageUploadState {
    image: File | undefined;
    previewImage: string | null;
    setImage: (image: File) => void;
    reset: () => void;
}

const initialState = {
    image: undefined,
    previewImage: null,
}

const useImageUploadStore = create<ImageUploadState>()(
    devtools((set, get) => ({
        ...initialState,

        setImage: (image) => set({ image, previewImage: URL.createObjectURL(image) }),

        reset: () => {
            set(initialState);
        }
    }))
);

export default useImageUploadStore;
