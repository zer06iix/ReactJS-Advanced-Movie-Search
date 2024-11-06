import { create } from "zustand";

const useCarouselStore = create((set) => ({
    popularMovies: [], // State to hold popular movies
    currentSlide: 0,
    nextSlide: () => set((state) => ({ currentSlide: (state.currentSlide + 1) % state.popularMovies.length })),
    prevSlide: () => set((state) => ({ currentSlide: (state.currentSlide - 1 + state.popularMovies.length) % state.popularMovies.length })),
    setPopularMovies: (movies) => set({ popularMovies: movies }),
}));

export default useCarouselStore;