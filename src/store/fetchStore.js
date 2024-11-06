/* eslint-disable no-unused-vars */
import { create } from "zustand";
import axios from "axios";
import { API_KEY, BASE_URL } from "../api/tmdb";


// Utility function to create API URLs
const createApiUrl = (endpoint, page) => 
    `${BASE_URL}${endpoint}?api_key=${API_KEY}&page=${page}`;

const useFetchStore = create((set) => ({
    fetchPopularMovies: async (page) => {
        console.log("Fetching popular movies");
        const url = createApiUrl('/movie/popular', page);
        const response = await axios.get(url);
        const movies = response.data.results;
        console.log(`Popular movies page ${page} got fetched.`);

        // Update the popularMovies in carouselStore.js
        return movies; // Return the fetched movies instead of updating the store here
    },
}));



export default useFetchStore;