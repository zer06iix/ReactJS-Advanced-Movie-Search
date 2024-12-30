import { create } from 'zustand';

const useMovieStore = create((set) => ({
    movie: null, // Movie details on the movie page
    setMovie: (movieDetails) => set({ movie: movieDetails }),

    popularMovies: [], // State to hold popular movies
    setPopularMovies: (movies) => set({ popularMovies: movies }),

    credits: [],
    setCredits: (credit) => set({ credits: credit }),

    genresMap: {}, //State to hold genres
    setGenresMap: (genres) => set({ genresMap: genres })
}));

export default useMovieStore;
