import { useEffect, useState } from 'react';
import PopularCarousel from '../components/carousels/PopularCarousel';
import useCarouselStore from '../store/carouselStore';
import useFetchStore from '../store/fetchStore';


export default function Popular() {
    const { fetchPopularMovies } = useFetchStore();
    const { popularMovies } = useCarouselStore()

    useEffect(() => {
        console.log("Fetching popular movies..."); // Log when fetching starts
        fetchPopularMovies(1); // Fetch the specified page of popular movies
    }, [fetchPopularMovies]);

    return (
        <div>
            <PopularCarousel movies={popularMovies} page={1}/>
            <PopularCarousel movies={popularMovies} page={2}/>
        </div>
    );
};
