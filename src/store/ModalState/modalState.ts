import { create } from "zustand";

type ModalState = {
    isOpen: boolean;
    content?: React.ReactNode;
};
type ModalAction = {
    openModal: (content: React.ReactNode) => void;
    closeModal: () => void;
};

export const useStoreModal = create<ModalState & ModalAction>()(
    (set, get) => ({
        isOpen: false,
        content: null,
        openModal: (content) =>
            set(() => ({
                isOpen: true,
                content: content,
            })),
        closeModal: () =>
            set(() => ({
                isOpen: false,
                content: null,
            }))

    }),
);