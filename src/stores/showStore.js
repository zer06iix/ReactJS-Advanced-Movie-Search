import { create } from 'zustand';

const useShowStore = create((set) => ({
    shows: null, // Shows details on the movie page
    setShows: (showDetails) => set({ shows: showDetails }),

    popularShows: [], // State to hold popular shows
    setPopularShow: (show) => set({ popularShows: show }),

    showsCredits: [],
    setCredits: (showsCredit) => set({ showsCredits: showsCredit }),

    genresMap: {}, // State to hold genres
    setGenresMap: (genres) => set({ genresMap: genres })
}));

export default useShowStore;
