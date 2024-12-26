/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactSVG } from 'react-svg';
import useFetchStore from '../store/fetchStore';
import Loading from '../components/AppComponents/Loading';
import useMovieStore from '../store/movieStore';
import Overview from '../components/MovieComponents/Overview';
import CastScroller from '../components/MovieComponents/cast/CastScroller';
import CustomScrollbar from '../components/AppComponents/Scrollbar';
import sprite from '../styles/sprite.svg';
import Genres from '../components/MovieComponents/Genres';
import IMDbRating from '../components/MovieComponents/rating/IMDbRating';
import VoteCount from '../components/MovieComponents/rating/VoteCount';
import Popularity from '../components/MovieComponents/rating/Popularity';

export default function MoviePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollContainerRef = useRef();
    const movieDetailRef = useRef(null); // Ref for .movie-detail-container

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
        ? movie.runtime < 60
            ? `${movie.runtime} min`
            : `${Math.floor(movie.runtime / 60)} h ${movie.runtime % 60} min`
        : null;

    const formattedRating = movie.adult ? 'Rated R' : 'Rated PG';
    const ratingTitle = movie.adult
        ? `R-rated movies are for adults, containing \nstrong language, sexual content, violence, \nor drug use. Viewer discretion is advised.`
        : `PG-rated movies are suitable for general \naudiences but may have material that requires \nparental guidance for younger children.`;

    const genreNames = movie.genres ? movie.genres.map((genre) => genre.name) : [];

    const numberOfCastMembers = credits && credits.cast ? credits.cast.length : 0;

    const getMovieTitleClass = (title) => {
        if (!title) return 'title-small'; // Default class
        const length = title.length;

        switch (true) {
            case length < 25:
                return 'title-large';
            case length < 40:
                return 'title-medium';
            default:
                return 'title-small';
        }
    };

    return (
        <>
            <div className="movie-page-container" ref={movieDetailRef}>
                <div className="movie-page-background-overlay"></div>
                <div className="movie-detail-container">
                    <div className="details-heading-section">
                        {/* Poster */}
                        <div className="poster">
                            <img
                                className="movie-poster"
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                title={movie.title}
                            />
                        </div>

                        <div className="right-side">
                            {/* Title */}
                            <div
                                className={`title ${getMovieTitleClass(movie.title)}`}
                            >
                                {movie.title}
                            </div>

                            {/* Release Year, Runtime, Adult Display */}
                            <p className="other-info">
                                <span
                                    className="popup"
                                    title={new Date(
                                        movie.release_date
                                    ).toLocaleDateString('en-GB')}
                                >
                                    {movie.release_date.slice(0, 4)}
                                </span>

                                {formattedRuntime !== null ? (
                                    <>
                                        <span className="separator">•</span>
                                        {formattedRuntime}
                                    </>
                                ) : null}

                                {movie.adult !== undefined ? (
                                    <>
                                        <span className="separator">•</span>
                                        <span className="popup" title={ratingTitle}>
                                            {formattedRating}
                                        </span>
                                    </>
                                ) : null}
                            </p>

                            <Genres />

                            {/* Rating, Vote Count, Popularity Display */}
                            <div className="rating-container">
                                <IMDbRating />

                                <span className="separator"></span>

                                <VoteCount />

                                <span className="separator"></span>

                                <Popularity />
                            </div>

                            {/* Description Section */}
                            <div className="description">
                                <p className="title">Description:</p>
                                <Overview
                                    isExpanded={isExpanded}
                                    toggleDescriptionExpand={toggleDescriptionExpand}
                                />
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
            </div>
            {/* <CustomScrollbar
                y
                contentRef={movieDetailRef}
                scrollableRef={document.body}
                scrollOffset={100}
            /> */}
        </>
    );
}
