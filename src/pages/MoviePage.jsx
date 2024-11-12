import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useFetchStore from "../store/fetchStore";
import Loading from "../components/App/Loading";
import useMovieStore from "../store/movieStore";
import { useQuery } from "@tanstack/react-query";


export default function MoviePage() {
    const { id: movieId } = useParams(); // Get the movie ID from the URL
    const { movie, setMovie, credits, setCredits } = useMovieStore();
    const { fetchMovieDetails, fetchCredits } = useFetchStore(); // Fetch function from our store

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

    useEffect(() => {
        if (movieData) setMovie(movieData);
        if (movieCreditsData) setCredits(movieCreditsData);
    }, [movieData, setMovie, movieCreditsData, setCredits]);

    if (!movie) return <Loading />;
    if (movieError) return <div className="error-container">Error: {movieError.message}</div>;
    if (movieCreditsError) return <div className="error-container">Error: {movieCreditsError.message}</div>;

    const ratingColor = movie.vote_average > 8 ? '#34ff19' : 
                        movie.vote_average > 6.9 ? 'yellowgreen' : 
                        movie.vote_average > 5 ? 'orange' : 
                        movie.vote_average > 3 ? 'red' : 'darkred';

    return (
        <div className="movie-page-container">
            <div className="movie-header">
                <img className="movie-poster" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="movie-info">
                    <h1 className="movie-title">{movie.title} ({new Date(movie.release_date).getFullYear()})</h1>
                    <p className="movie-release-date" style={{ fontStyle: 'italic', color: 'lightgray' }}>
                        Released on: {new Date(movie.release_date).toLocaleDateString()} 
                    </p>
                    <p className="movie-rating">
                        Rating: <span className="rating-value" style={{ color: ratingColor }}> {movie.vote_average.toFixed(1)} </span>
                    </p>
                    <p className="movie-overview">{movie.overview}</p>
                </div>
            </div>
            <div className="text-white additional-details">
                <h2>Cast</h2>
                {credits.cast.length > 0 ? (
                    <p>{credits.cast.map(member => member.name).join(', ')}</p>
                ) : (
                    <p>No cast information available.</p>
                )}
            </div>
        </div>
    );
}