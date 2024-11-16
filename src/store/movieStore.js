import { create } from 'zustand';

const useMovieStore = create((set) => ({
    movie: null, // Movie details on the movie page
    setMovie: (movieDetails) => set({ movie: movieDetails }),

    popularMovies: [], // State to hold popular movies
    setPopularMovies: (movies) => set({ popularMovies: movies }),

    credits: [],
    setCredits: (credit) => set({ credits: credit })
}));

export default useMovieStore;
