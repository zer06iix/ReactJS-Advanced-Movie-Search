/* eslint-disable no-unused-vars */
import { create } from "zustand"
import axios from "axios"
import { API_KEY, BASE_URL } from "../api/tmdb"
import useCarouselStore from "./carouselStore"

// Utility Function for API Call
const fetchPopularMovies = async (page) => {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    return await axios.get(url)
}

const useFetchStore = create((set) => ({
    fetchPopularMovies: async (page) => {
        try {
            const response = await fetchPopularMovies(page)
            const movies = response.data.results
            // console.log("Fetched Movies:", movies)

            // Update the popularMovies in carouselStore.js
            useCarouselStore.getState().setPopularMovies(movies)
        } catch (error) {
            console.error("Error while fetching popular movies:", error)
        }
    },
}))



export default useFetchStore