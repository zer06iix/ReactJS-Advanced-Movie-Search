/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../api/tmdb';

// Utility function to create API URLs
const createApiUrl = (endpoint, page) =>
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}`;

const useFetchStore = create((set) => ({
    fetchPopularMovies: async (page) => {
        console.log('Fetching popular movies'); // Log when fetching starts
        const url = createApiUrl('/movie/popular', page);
        const response = await axios.get(url);
        const movies = response.data.results;
        return movies; // Ensure this is returning an array
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

    fetchGenres: async () => { // New function to fetch genres
        try {
            console.log('Fetching genres');
            // const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
            const url = createApiUrl(`/genre/movie/list`, 1);
            const response = await axios.get(url);
            console.log('Genres fetched successfully');
            return response.data.genres; // Return the genres
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },

    fetchGenresMap: async () => { // New function to fetch genres and transform them into a map
        try {
            const genres = await useFetchStore.getState().fetchGenres(); // Fetch genres
            const genresMap = genres.reduce((acc, { id, name }) => {
                acc[id] = name;
                return acc;
            }, {});
            return genresMap; // Return the genres map
        } catch (error) {
            console.error('Error fetching genres map:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    }
}));

export default useFetchStore;
