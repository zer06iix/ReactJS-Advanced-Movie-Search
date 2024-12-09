/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReactSVG } from 'react-svg';
import useFetchStore from '../store/fetchStore';
import Loading from '../components/AppComponents/Loading';
import useMovieStore from '../store/movieStore';
import Genre from '../components/MovieComponents/Genre';
import VoteAverage from '../components/MovieComponents/VoteAverage';
import Overview from '../components/MovieComponents/Overview';
import CastScroller from '../components/MovieComponents/cast/CastScroller';
import sprite from '../sprite.svg';

export default function MoviePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const { id: movieId } = useParams(); // Get the movie ID from the URL
    const { movie, setMovie, credits, setCredits, genresMap } = useMovieStore();

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

    useEffect(() => {
        fetchGenres(); // Fetch genres when the component mounts
    }, [fetchGenres]);

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
        return <Loading />;
    }

    if (movieError) {
        console.log('MovieError:', movieError);
        return (
            <div className="error-container">MovieError: {movieError.message}</div>
        );
    }

    if (movieCreditsError) {
        console.log('CreditsError:', movieCreditsError);
        return (
            <div className="error-container">
                CreditsError: {movieCreditsError.message}
            </div>
        );
    }

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

    console.log(movie);

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

                        <div className="rating-container">
                            <div className="item imdb-rating">
                                <p className="label">IMDb Rating</p>

                                <div className="value">
                                    <svg className="icon">
                                        <use xlinkHref={`${sprite}#rating-icon`} />
                                    </svg>
                                    <p className="average">{movie.vote_average}</p>
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

                <div className="cast-members-container">
                    <p className="title">
                        Cast Members
                        <span>{24}</span>
                        <svg className="icon">
                            <use xlinkHref={`${sprite}#arrow-forward`} />
                        </svg>
                    </p>
                    <CastScroller />
                </div>
            </div>

            <ReactSVG src={sprite} style={{ display: 'none' }} />
        </div>
    );
}
