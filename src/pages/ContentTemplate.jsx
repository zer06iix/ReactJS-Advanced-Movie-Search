/* eslint-disable react/prop-types */
// import { useState } from 'react';
import Loading from '../components/app/Loading';
import MovieGenres from '../components/moviePage/MovieGenres';
import MovieIMDbRating from '../components/moviePage/movieRating/MovieIMDbRating';
import MovieVoteCount from '../components/moviePage/movieRating/MovieVoteCount';
import MoviePopularity from '../components/moviePage/movieRating/MoviePopularity';
import MovieOverview from '../components/moviePage/MovieOverview';
import MovieCastScroller from '../components/moviePage/movieCast/MovieCastScroller';
import sprite from '../styles/sprite.svg';
import { ReactSVG } from 'react-svg';

const ContentTemplate = ({ type, media, creditsData, genresMap }) => {
    // const [isExpanded, setIsExpanded] = useState(false);
    const isMovie = type === 'Movie' ? true : false;
    const mediaTitle = isMovie ? media.title : media.name;
    const showFormattedDate = !isMovie ? (
        media.in_production ? (
            <>
                <span className="date" title={`${media.first_air_date} (in production)`}>
                    Since {media.first_air_date.slice(0, 4)}
                </span>
            </>
        ) : (
            <>
                <span className="date" title={media.first_air_date}>
                    {media.first_air_date.slice(0, 4)}
                </span>
                <span className="date-separator">–</span>
                <span className="date" title={media.last_air_date}>
                    {media.last_air_date.slice(0, 4)}
                </span>
            </>
        )
    ) : null;

    const genreNames = media.genres ? media.genres.map((genre) => genre.name) : [];

    if (!media || !genresMap) {
        return <Loading />;
    }

    const formattedRuntime = media.runtime
        ? media.runtime < 60
            ? `${media.runtime} min`
            : (() => {
                  const hours = Math.floor(media.runtime / 60);
                  const minutes = media.runtime % 60;
                  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
              })()
        : null;

    const formattedRating = media.adult ? 'Rated R' : 'Rated PG';
    const ratingTitle = media.adult
        ? `R-rated movies are for adults, containing \nstrong language, sexual content, violence, \nor drug use. Viewer discretion is advised.`
        : `PG-rated movies are suitable for general \naudiences but may have material that requires \nparental guidance for younger children.`;

    const numberOfCastMembers =
        creditsData && creditsData.cast ? creditsData.cast.length : 0;

    const getMovieTitleClass = (title) => {
        if (!title) return 'title-small';
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

    // const toggleDescriptionExpand = () => {
    //     setIsExpanded(!isExpanded);
    // };

    const imagePath =
        media.poster_path || media.profile_path // Use poster_path, fallback to profile_path if needed
            ? `https://image.tmdb.org/t/p/w500${media.poster_path || media.profile_path}`
            : null;
    // : placeholderImage; // Use a placeholder image if neither exists

    console.log(media);

    return (
        <div className="movie-page-container">
            <div className="movie-page-background-overlay"></div>
            <div className="movie-detail-container">
                <div className="details-heading-section">
                    {/* Poster */}
                    <div className="poster">
                        <img
                            className="item-poster"
                            src={imagePath}
                            alt={media.title || media.name}
                            title={media.title || media.name}
                        />
                    </div>

                    <div className="right-side">
                        <div className={`title ${getMovieTitleClass(mediaTitle)}`}>
                            {mediaTitle}
                        </div>

                        {isMovie ? (
                            // Other info - movies
                            <p className="other-info">
                                <span
                                    title={new Date(
                                        media.release_date
                                    ).toLocaleDateString('en-GB')}
                                >
                                    {media.release_date.slice(0, 4)}
                                </span>

                                {formattedRuntime !== null && (
                                    <>
                                        <span className="separator">•</span>
                                        {formattedRuntime}
                                    </>
                                )}

                                {media.adult !== undefined && (
                                    <>
                                        <span className="separator">•</span>
                                        <span title={ratingTitle}>{formattedRating}</span>
                                    </>
                                )}
                            </p>
                        ) : (
                            // Other info - shows
                            <p className="other-info">
                                {showFormattedDate}

                                <span className="separator">•</span>

                                {`${media.seasons.length} Seasons`}

                                {media.adult !== undefined && (
                                    <>
                                        <span className="separator">•</span>
                                        <span title={ratingTitle}>{formattedRating}</span>
                                    </>
                                )}
                            </p>
                        )}

                        {/* Genres */}
                        <p className="genres">
                            <div className="genre-container">
                                {genreNames.map((name, index) => (
                                    <>
                                        <a key={index} className="genre-item">
                                            {name}
                                        </a>
                                    </>
                                ))}
                            </div>
                        </p>

                        {/* Rating */}
                        <div className="rating-container">
                            <div className="item imdb-rating">
                                <p className="label">IMDb Rating</p>
                                <div className="value">
                                    <svg className="icon">
                                        <use xlinkHref={`${sprite}#rating-icon`} />
                                    </svg>
                                    <p className="average">
                                        {media.vote_average.toFixed(1)}
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
                                    <p className="average">{media.vote_count}</p>
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
                                        {media.popularity >= 1000
                                            ? `${(media.popularity / 1000).toFixed(1)}k`
                                            : media.popularity.toFixed(0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="description">
                            <p className="title">Description</p>
                            <p className="info">{media.overview}</p>
                            <button className="expander">Expand</button>
                        </div>

                        {/* <p className="info">{movie.overview}</p>
                            <button className="expander" onClick={onClick}>
                                {isExpanded ? 'Collapse' : 'Expand'}
                            </button> */}
                    </div>
                </div>

                {creditsData && creditsData.cast && (
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
                        {isMovie && <MovieCastScroller />}
                    </div>
                )}
            </div>

            <ReactSVG src={sprite} style={{ display: 'none' }} />
        </div>
    );
};

export default ContentTemplate;
