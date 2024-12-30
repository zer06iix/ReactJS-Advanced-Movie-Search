/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../api/tmdb';

// Utility function to create API URLs
const createApiUrl = (endpoint) => `${BASE_URL}${endpoint}?api_key=${API_KEY}`;

// Utility function to create API URLs with their page
const createApiUrlWithPage = (endpoint, page) =>
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}`;

// Utility function to create API URLs with their query
const createApiUrlWithQuery = (endpoint, query) =>
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&query=${query}`;

const useFetchStore = create((set) => ({
    fetchPopularMovies: async (page) => {
        console.log('Fetching popular movies'); // Log when fetching starts
        const url = createApiUrlWithPage('/movie/popular', page);
        const response = await axios.get(url);
        const movies = response.data.results;
        return movies; // Ensure this is returning an array
    },
    fetchPopularSeries: async (page) => {
        console.log('Fetching popular shows'); // Log when fetching starts
        const url = createApiUrlWithPage('/tv/popular', page);
        const response = await axios.get(url);
        const movies = response.data.results;
        return movies; // Ensure this is returning an array
    },

    // Movie page
    fetchMovieDetails: async (id) => {
        console.log(`Fetching movie details.`);
        const url = createApiUrl(`/movie/${id}`);
        const response = await axios.get(url);
        console.log('Movie details got fetched');
        return response.data; // Return the movie details
    },

    fetchMovieCredits: async (id) => {
        const url = createApiUrl(`/movie/${id}/credits`);
        const response = await axios.get(url);
        return response.data;
    },

    // Shows page
    fetchSeriesDetails: async (id) => {
        console.log(`Fetching tv details.`);
        const url = createApiUrl(`/tv/${id}`);
        const response = await axios.get(url);
        console.log('Shows details got fetched');
        return response.data; // Return the movie details
    },

    fetchSeriesCredits: async (id) => {
        const url = createApiUrl(`/tv/${id}/credits`);
        const response = await axios.get(url);
        return response.data;
    },

    fetchGenres: async () => {
        // New function to fetch genres
        try {
            console.log('Fetching genres');
            // const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
            const url = createApiUrl(`/genre/list`);
            const response = await axios.get(url);
            console.log('MovieGenres fetched successfully');
            return response.data.genres; // Return the genres
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },

    fetchGenresMap: async () => {
        // New function to fetch genres and transform them into a map
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
    },

    fetchMovieQueries: async (query) => {
        const url = createApiUrlWithQuery(`/search/movie`, query);
        const response = await axios.get(url);

        return response.data.results;
    },

    fetchSeriesQueries: async (query) => {
        const url = createApiUrlWithQuery(`/search/tv`, query);
        const response = await axios.get(url);

        return response.data.results;
    }
}));

export default useFetchStore;
