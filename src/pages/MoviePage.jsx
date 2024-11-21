/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useFetchStore from '../store/fetchStore';
import Loading from '../components/AppComponents/Loading';
import useMovieStore from '../store/movieStore';
import { useQuery } from '@tanstack/react-query';

export default function MoviePage() {
    const { id: movieId } = useParams(); // Get the movie ID from the URL
    const { 
        movie, setMovie, 
        credits, setCredits, 
        genresMap, setGenresMap, 
    } = useMovieStore();

    const { fetchMovieDetails, fetchCredits, fetchGenresMap } = useFetchStore(); // Fetch function from our store

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

    const { data: genresData, error: genresError } = useQuery({
        queryKey: ['genresMap'],
        queryFn: () => fetchGenresMap
    });
    
    const runtimeToHours = movie ? Math.floor(movie.runtime / 60) : 0;
    const runtimeToMinutes = movie ? movie.runtime % 60 : 0;
    const formattedRuntime = `${runtimeToHours}h ${runtimeToMinutes}m`;

    useEffect(() => {
        if (genresMap) setGenresMap(genresData);
    }, [genresData, genresMap, setGenresMap]);

    useEffect(() => {
        if (movieData) setMovie(movieData);
        if (movieCreditsData) setCredits(movieCreditsData);
    }, [movieData, setMovie, movieCreditsData, setCredits]);

    if (!movie) return <Loading />;

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

    if (genresError) {
        console.log('GenresError:', genresError);
        return (
            <div className="error-container">GenresError: {genresError.message}</div>
        );
    }

    const ratingColor =
        movie.vote_average > 8
            ? '#34ff19'
            : movie.vote_average > 6.9
            ? 'yellowgreen'
            : movie.vote_average > 5
            ? 'orange'
            : movie.vote_average > 3
            ? 'red'
            : 'darkred';
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
                    <p
                        className="movie-release-date"
                        style={{
                            fontStyle: 'italic',
                            color: 'lightgray'
                        }}
                    >
                        Released on:{' '}
                        {new Date(movie.release_date).toLocaleDateString()} - {formattedRuntime}
                    </p>
                    <p className="movie-rating">
                        Rating:{' '}
                        <span
                            className="rating-value"
                            style={{
                                color: ratingColor
                            }}
                        >
                            {' '}
                            {movie.vote_average.toFixed(1)}{' '}
                        </span>
                    </p>    
                    <div className="genres-container">
                        {Array.isArray(movie.genres) ? movie.genres.map(genre => (
                            <div key={genre.id} className="genres-item">
                                {genre.name}
                            </div>
                        )) : 'No genres available'}
                    </div>
                    <p className="movie-overview">{movie.overview}</p>
                </div>
            </div>
            <h1 className='cast-header'>Cast</h1>
            <div className="cast-scroller-container">
                {/* <h1 className="cast-header">Cast</h1> Fixed header */}
                <div className="cast-scroller">
                    {credits.cast.length > 0 ? (
                        credits.cast.map((member) => (
                            <div key={member.id} className="cast-member">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                                    alt={member.name}
                                    className="cast-image"
                                />
                                <p className="cast-name">{member.name}</p>
                                <p className="cast-character-name">{member.character}</p>
                            </div>
                        ))
                    ) : (
                        <p>No cast information available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
