/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../api/tmdb';

// Utility function to create API URLs
const createApiUrl = (endpoint, page) =>
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}`;

const useFetchStore = create((set) => ({
    fetchPopularMovies: async (page) => {
        console.log('Fetching popular movies');
        const url = createApiUrl('/movie/popular', page);
        const response = await axios.get(url);
        const movies = response.data.results;
        console.log(`Popular movies page ${page} got fetched.`);

        // Update the popularMovies in carouselStore.js
        // Return the fetched movies instead of updating the store here
        return movies;
    },
    fetchMovieDetails: async (id) => {
        try {
            console.log(`Fetching movie details.`);
            const url = createApiUrl(`/movie/${id}`, 1);
            const response = await axios.get(url);
            console.log('Movie details got fetched');
            return response.data; // Return the movie details
        } catch (error) {
            console.error('Error fetching movie details:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },
    fetchCredits: async (id) => {
        const url = createApiUrl(`/movie/${id}/credits`, 1);
        const response = await axios.get(url);
        return response.data;
    },
    fetchGenres: async () => {
        try {
            console.log('Fetching genres');
            const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
            const response = await axios.get(url);
            const genres = response.data.genres.reduce((acc, { id, name }) => {
                acc[id] = name;
                return acc;
            }, {});
            console.log('Genres fetched successfully');
            return genres;
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error;
        }
    }
}));

export default useFetchStore;
