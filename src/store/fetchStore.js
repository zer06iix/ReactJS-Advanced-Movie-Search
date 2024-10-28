/* eslint-disable no-unused-vars */
import { create } from "zustand";
import axios from "axios";
import { API_KEY, BASE_URL } from "../api/tmdb";
import useCarouselStore from "./carouselStore";



const useFetchStore = create((set) => ({
    fetchPopularMovies: async (page) => {
        try{
            const response = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`)

            console.log("Fetched Movies:", response.data.results);

            // Update the popularMovies in carouselStore.js
            useCarouselStore.getState().setPopularMovies(response.data.results);
        } catch(error) {
            console.log("Error while fetching popular movies: ", error);
        }
    },

}))


export default useFetchStore;