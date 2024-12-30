import { create } from 'zustand';

const useShowStore = create((set) => ({
    show: null, // Series details on the movie page
    setShow: (showDetail) => set({ show: showDetail }),

    popularShow: [], // State to hold popular series
    setPopularShow: (show) => set({ popularShow: show }),

    credits: [],
    setCredits: (credit) => set({ credits: credit }),

    genresMap: {}, //State to hold genres
    setGenresMap: (genres) => set({ genresMap: genres })
}));

export default useShowStore;
