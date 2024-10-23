import { create } from "zustand";

const useCarouselStore = create((set) => ({
    slides: [
        { path: '/imagePlaceholder.png', title: 'Movie Title 1', rating: '6.7' },
        { path: '/imagePlaceholder.png', title: 'Movie Title 2', rating: '7.2' },
        { path: '/imagePlaceholder.png', title: 'Movie Title 3', rating: '8.1' },
        { path: '/imagePlaceholder.png', title: 'Movie Title 4', rating: '5.5' },
        { path: '/imagePlaceholder.png', title: 'Movie Title 5', rating: '9.0' },
    ],
    currentSlide: 0,
    nextSlide: () => set((state) => ({currentSlide: (state.currentSlide + 1) % state.slides.length})),
    prevSlide: () => set((state) => ({currentSlide: (state.currentSlide - 1 + state.slides.length) % state.slides.length}))
}));

export default useCarouselStore;