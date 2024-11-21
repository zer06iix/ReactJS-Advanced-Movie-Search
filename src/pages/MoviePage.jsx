/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useFetchStore from '../store/fetchStore';
import Loading from '../components/AppComponents/Loading';
import useMovieStore from '../store/movieStore';
import Genre from '../components/MovieComponents/Genre';
import VoteAverage from '../components/MovieComponents/VoteAverage';
import Overview from '../components/MovieComponents/Overview';
import CastScroller from '../components/MovieComponents/cast/CastScroller';

export default function MoviePage() {
    const [isLoading, setIsLoading] = useState(true); 


    const { id: movieId } = useParams(); // Get the movie ID from the URL
    const { 
        movie, setMovie, 
        credits, setCredits,
        genresMap
    } = useMovieStore();
    
    const { fetchMovieDetails, fetchCredits, fetchGenres } = useFetchStore(); // Fetch function from our store

    const { data: movieData, error: movieError } = useQuery({
        queryKey: ['movie', movieId],
        queryFn: () => fetchMovieDetails(movieId),
        enabled: !!movieId
    });

    const { data: movieCreditsData, error: movieCreditsError } = useQuery({
        queryKey: ['movieCredits', movieId],
        queryFn: () => fetchCredits(movieId),
        enabled: !!movieId
    });
    
    const runtimeToHours = movie ? Math.floor(movie.runtime / 60) : 0;
    const runtimeToMinutes = movie ? movie.runtime % 60 : 0;
    const formattedRuntime = `${runtimeToHours}h ${runtimeToMinutes}m`;

    useEffect(() => {
        fetchGenres(); // Fetch genres when the component mounts
    }, [fetchGenres]);

    // You can use a loading state

    useEffect(() => {
        if (genresMap && movie) {
            setIsLoading(false); // Set loading to false when genresMap and movie are available
        }
    }, [genresMap, movie]);

    useEffect(() => {
        if (movieData) {
            setMovie(movieData);
        }
        if (movieCreditsData) setCredits(movieCreditsData);
    }, [movieData, setMovie, movieCreditsData, setCredits]);

    if (!movie) return <Loading />;

    if (!genresMap) {
        return <Loading />; // or some other loading state
    }

    if (movieError) {
        console.log('MovieError:', movieError);
        return <div className="error-container">MovieError: {movieError.message}</div>;
    }

    if (movieCreditsError) {
        console.log('CreditsError:', movieCreditsError);
        return (
            <div className="error-container">CreditsError: {movieCreditsError.message}</div>
        );
    }
    return (
        <div className="movie-page-container">
            <div className="movie-header">
                <img
                    className="movie-poster"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <div className="movie-info">
                    <h1 className="movie-title">
                        {movie.title} ({new Date(movie.release_date).getFullYear()})
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p
                            className="movie-release-date"
                            style={{
                                fontStyle: 'italic',
                                color: 'lightgray',
                                marginRight: '10px'
                            }}
                        >
                            Released on:{' '}
                            {new Date(movie.release_date).toLocaleDateString()} 
                        </p> 
                        <p className="movie-showtime"
                            style={{
                                    fontStyle: 'italic',
                                    color: 'lightgray',
                                    marginRight: '10px'
                             }}
                        >
                           - {formattedRuntime}
                        </p>
                    </div>
                    <div className="movie-rating" style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ marginRight: '5px' }}>
                            Rating:
                        </p>
                        <span style={{ marginTop: '4px' }}>
                            <VoteAverage voteAverage={movie.vote_average} />
                        </span>
                        <p
                            style={{
                                fontStyle: 'italic',
                                color: 'lightgray',
                                fontSize: '13px',
                                marginTop: '7px'
                            }}
                        >
                            By {movie.vote_count} people
                        </p>
                    </div>
                    <div className="genres-container">
                        {isLoading ? (
                            <span className="genres-item">Loading genres...</span> // Display loading message
                        ) : (
                            movie.genre_ids && movie.genre_ids.length > 0 ? (
                                <Genre genreIds={movie.genre_ids} /> 
                            ) : (
                                <span className='genres-item'>No genres available</span>
                            )
                        )}
                    </div>

                    <Overview movie={movie}/>
                </div>
            </div>
            <div className="cast-container">
                <h1 className="cast-header">Cast</h1>
                <CastScroller />
            </div>
        </div>
    );
}
