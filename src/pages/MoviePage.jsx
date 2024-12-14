/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactSVG } from 'react-svg';
import useFetchStore from '../store/fetchStore';
import Loading from '../components/AppComponents/Loading';
import useMovieStore from '../store/movieStore';
import CastScroller from '../components/MovieComponents/cast/CastScroller';
import CustomScrollbar from '../components/AppComponents/Scrollbar';
import sprite from '../styles/sprite.svg';

export default function MoviePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollContainerRef = useRef();

    const { id: movieId } = useParams();
    const { movie, setMovie, credits, setCredits, genresMap } = useMovieStore();
    const { fetchMovieDetails, fetchCredits, fetchGenres } = useFetchStore();

    // Fetch movie details
    const { data: movieData, error: movieError } = useQuery({
        queryKey: ['movie', movieId],
        queryFn: () => fetchMovieDetails(movieId),
        enabled: !!movieId // Only run if movieId is available
    });

    // Fetch movie credits
    const { data: movieCreditsData, error: movieCreditsError } = useQuery({
        queryKey: ['movieCredits', movieId],
        queryFn: () => fetchCredits(movieId),
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
        return (
            <div className="error-container">MovieError: {movieError.message}</div>
        );
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

    // Toggle description expansion
    const toggleDescriptionExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const formattedRuntime = movie.runtime
        ? `${Math.floor(movie.runtime / 60)} h ${movie.runtime % 60} min`
        : null;

    const formattedRating = movie.adult ? 'Rated R' : 'Rated PG';
    const ratingTitle = movie.adult
        ? `R-rated movies are for adults, containing \nstrong language, sexual content, violence, \nor drug use. Viewer discretion is advised.`
        : `PG-rated movies are suitable for general \naudiences but may have material that requires \nparental guidance for younger children.`;

    const genreNames = movie.genres ? movie.genres.map((genre) => genre.name) : [];

    const numberOfCastMembers = credits && credits.cast ? credits.cast.length : 0;

    return (
        <div className="movie-page-container">
            <div className="movie-page-background-overlay"></div>
            <div className="movie-detail-container">
                <div className="details-heading-section">
                    <div className="poster">
                        <img
                            className="movie-poster"
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            title={movie.title}
                        />
                    </div>
                    <div className="right-side">
                        <div className="title">{movie.title}</div>
                        <p className="other-info">
                            {new Date(movie.release_date).getFullYear()}

                            {formattedRuntime !== null ? (
                                <>
                                    <span className="separator">•</span>
                                    {formattedRuntime}
                                </>
                            ) : null}

                            {movie.adult !== undefined ? (
                                <>
                                    <span className="separator">•</span>
                                    <div
                                        title={ratingTitle}
                                        style={{
                                            display: 'inline',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        {formattedRating}
                                    </div>
                                </>
                            ) : null}
                        </p>

                        <pre className="genres">
                            <span>Genres:</span> {genreNames.join(', ')}
                        </pre>

                        {/* Rating, Vote Count, Popularity Display */}
                        <div className="rating-container">
                            <div className="item imdb-rating">
                                <p className="label">IMDb Rating</p>
                                <div className="value">
                                    <svg className="icon">
                                        <use xlinkHref={`${sprite}#rating-icon`} />
                                    </svg>
                                    <p className="average">
                                        {movie.vote_average.toFixed(1)}
                                    </p>
                                </div>
                            </div>

                            <span className="separator"></span>

                            <div className="item vote-count">
                                <p className="label">Vote Count</p>
                                <div className="value">
                                    <svg className="icon">
                                        <use xlinkHref={`${sprite}#vote-count`} />
                                    </svg>
                                    <p className="average">{movie.vote_count}</p>
                                </div>
                            </div>

                            <span className="separator"></span>

                            <div className="item popularity">
                                <p className="label">Popularity</p>
                                <div className="value">
                                    <svg className="icon">
                                        <use xlinkHref={`${sprite}#popularity`} />
                                    </svg>
                                    <p className="average">
                                        {movie.popularity >= 1000
                                            ? `${(movie.popularity / 1000).toFixed(1)}k`
                                            : movie.popularity}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="description">
                            <p className="title">Description:</p>
                            <p className="info">{movie.overview}</p>
                            <button
                                className="expander"
                                onClick={toggleDescriptionExpand}
                            >
                                {isExpanded ? 'Collapse' : 'Expand'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cast Members Section */}
                <div className="cast-members-container">
                    <div className="cast-members-header">
                        <p className="title">
                            Cast Members
                            <span>{numberOfCastMembers}</span>
                            <svg className="icon">
                                <use xlinkHref={`${sprite}#arrow-forward`} />
                            </svg>
                        </p>
                        <button className="view-full-cast-button">
                            All cast & crew
                        </button>
                    </div>
                    <CastScroller />
                </div>
            </div>

            <ReactSVG src={sprite} style={{ display: 'none' }} />
            <CustomScrollbar y />
        </div>
    );
}
