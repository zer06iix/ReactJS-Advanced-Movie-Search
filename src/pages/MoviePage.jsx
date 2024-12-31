/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import useFetchStore from '../stores/fetchStore';
import useMovieStore from '../stores/movieStore';
import Loading from '../components/app/Loading';
import ContentTemplate from './ContentTemplate';

export default function MoviePage() {
    const [isLoading, setIsLoading] = useState(true);

    const { id: movieId } = useParams();
    const { movie, setMovie, credits, setCredits, genresMap } = useMovieStore();
    const { fetchMovieDetails, fetchMovieCredits, fetchGenres } = useFetchStore();

    // Fetch movie details
    const { data: movieData, error: movieError } = useQuery({
        queryKey: ['movie', movieId],
        queryFn: () => fetchMovieDetails(movieId),
        enabled: !!movieId // Only run if movieId is available
    });

    // Fetch movie credits
    const { data: movieCreditsData, error: movieCreditsError } = useQuery({
        queryKey: ['movieCredits', movieId],
        queryFn: () => fetchMovieCredits(movieId),
        enabled: !!movieId
    });

    // Fetch genres when the component mounts
    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    useEffect(() => {
        if (genresMap && movie) {
            setIsLoading(false);
        }
    }, [genresMap, movie]);

    // Update movie and credits state when data is fetched
    useEffect(() => {
        if (movieData) {
            setMovie(movieData);
        }
        if (movieCreditsData) {
            setCredits(movieCreditsData);
        }
    }, [movieData, setMovie, movieCreditsData, setCredits]);

    if (!movie || isLoading) return <Loading />;

    if (!genresMap) {
        return <Loading />;
    }

    // Handle and display movie fetch errors
    if (movieError) {
        console.log('MovieError:', movieError);
        return <div className="error-container">MovieError: {movieError.message}</div>;
    }

    // Handle and display credits fetch errors
    if (movieCreditsError) {
        console.log('CreditsError:', movieCreditsError);
        return (
            <div className="error-container">
                CreditsError: {movieCreditsError.message}
            </div>
        );
    }

    return (
        <ContentTemplate
            type="Movie"
            media={movie}
            creditsData={credits}
            genresMap={genresMap}
        />
    );
}
