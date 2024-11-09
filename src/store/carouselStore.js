import { create } from 'zustand';

const useCarouselStore = create((set) => ({
  popularMovies: [], // State to hold popular movies
  setPopularMovies: (movies) => set({ popularMovies: movies }),
  currentSlide: 0,
  nextSlide: () =>
    set((state) => ({
      currentSlide: (state.currentSlide + 1) % state.popularMovies.length
    })),
  prevSlide: () =>
    set((state) => ({
      currentSlide:
        (state.currentSlide - 1 + state.popularMovies.length) %
        state.popularMovies.length
    }))
}));

export default useCarouselStore;
