import { create } from 'zustand';

const useSeriesStore = create((set) => ({
    series: null, // Series details on the movie page
    setSeries: (seriesDetails) => set({ series: seriesDetails }),

    popularSeries: [], // State to hold popular series
    setPopularSeries: (series) => set({ popularSeries: series }),

    credits: [],
    setCredits: (credit) => set({ credits: credit }),

    genresMap: {}, //State to hold genres
    setGenresMap: (genres) => set({ genresMap: genres })
}));

export default useSeriesStore;
