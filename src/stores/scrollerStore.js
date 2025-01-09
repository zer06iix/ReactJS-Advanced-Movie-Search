import { create } from "zustand";

const useScrollerStore = create((set) => ({
    scrollSpeed: 50, // Controls how fast the scroll is. (changeable)

    translateX: 0, 
    setTranslateX: (newTranslateX) => set({ translateX: newTranslateX }),

    isDragging: false,
    setIsDragging: (boolean) => set({ isDragging: boolean}),

    startX: 0,
    setStartX: (newStartX) => set({ startX: newStartX }),

    maxTranslateX: 0, // State for max translate
    setMaxTranslateX: (newMaxTranslateX) => set({ maxTranslateX: newMaxTranslateX })
}));

export default useScrollerStore;