/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import Loading from '../components/app/Loading';
import MovieCastScroller from '../components/moviePage/movieCast/MovieCastScroller';
import sprite from '../styles/sprite.svg';
import { ReactSVG } from 'react-svg';

const ContentTemplate = ({ type, media, creditsData, genresMap }) => {
    const [lastViewportWidth, setLastViewportWidth] = useState(window.innerWidth);
    const [showExpanderBtn, setShowExpanderBtn] = useState(true);
    const [showOverview, setShowOverview] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [lastVisibleWidth, setLastVisibleWidth] = useState(null);
    const overviewSection = useRef(null);
    const expanderBtnRef = useRef(null);
    const infoRef = useRef(null);
    const shadowOverlayRef = useRef(null);

    useEffect(() => {
        // Handles responsive layout changes based on viewport width and overview's info text height
        const handleResize = () => {
            const currentViewportWidth = window.innerWidth;

            if (infoRef.current) {
                const height = infoRef.current.clientHeight;
                if (height === 96) {
                    // For 4 lines of overview text
                    document.documentElement.style.setProperty(
                        '--overview-height-offset',
                        '96px'
                    );
                } else if (height === 120) {
                    // For 5 lines of overview text
                    document.documentElement.style.setProperty(
                        '--overview-height-offset',
                        '120px'
                    );
                }

                if (height > 122) {
                    // Hide overview section when text is too long
                    setShowExpanderBtn(false);
                    setShowOverview(false);
                    if (!lastVisibleWidth) {
                        setLastVisibleWidth(currentViewportWidth);
                    }
                    if (overviewSection.current) {
                        overviewSection.current.style.display = 'none';
                    }
                } else if (height <= 72) {
                    // Show overview without expander for short text
                    setShowExpanderBtn(true);
                    setShowOverview(true);
                    if (overviewSection.current) {
                        overviewSection.current.style.display = 'block';
                        if (shadowOverlayRef.current) {
                            shadowOverlayRef.current.style.opacity = '0';
                        }
                        if (expanderBtnRef.current) {
                            expanderBtnRef.current.style.opacity = '0';
                        }
                    }
                } else {
                    // Show overview with expander for medium length text
                    setShowExpanderBtn(true);
                    setShowOverview(true);
                    if (overviewSection.current) {
                        overviewSection.current.style.display = 'block';
                        if (shadowOverlayRef.current) {
                            shadowOverlayRef.current.style.opacity = isExpanded
                                ? '0'
                                : '1';
                        }
                        if (expanderBtnRef.current) {
                            expanderBtnRef.current.style.opacity = '1';
                        }
                    }
                }
            }

            // Handle overview visibility based on viewport width changes
            if (lastVisibleWidth && currentViewportWidth <= lastVisibleWidth) {
                setShowOverview(false);
                if (overviewSection.current) {
                    overviewSection.current.style.display = 'none';
                }
            } else if (lastVisibleWidth && currentViewportWidth > lastVisibleWidth) {
                setShowOverview(true);
                setShowExpanderBtn(true);
                if (overviewSection.current) {
                    overviewSection.current.style.display = 'block';
                }
                setLastVisibleWidth(null);
            }

            // Update viewport width tracking only when overview height is manageable
            if (!infoRef.current || infoRef.current.clientHeight <= 122) {
                setLastViewportWidth(currentViewportWidth);
            }
        };

        handleResize(); // Initial layout setup
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [media.overview, lastViewportWidth, showOverview, lastVisibleWidth, isExpanded]);

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

    // Format runtime into hours and minutes
    const formattedRuntime = media.runtime
        ? media.runtime < 60
            ? `${media.runtime} min`
            : (() => {
                  const hours = Math.floor(media.runtime / 60);
                  const minutes = media.runtime % 60;
                  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
              })()
        : null;

    // Format content rating and tooltip text
    const formattedRating = media.adult ? 'Rated R' : 'Rated PG';
    const ratingTitle = media.adult
        ? `R-rated movies are for adults, containing \nstrong language, sexual content, violence, \nor drug use. Viewer discretion is advised.`
        : `PG-rated movies are suitable for general \naudiences but may have material that requires \nparental guidance for younger children.`;

    const numberOfCastMembers =
        creditsData && creditsData.cast ? creditsData.cast.length : 0;

    // Determine title size class based on length
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

    // Get poster image path or return null (going to be replaced by placeholder) if false
    const imagePath =
        media.poster_path || media.profile_path
            ? `https://image.tmdb.org/t/p/w500${media.poster_path || media.profile_path}`
            : null;

    console.log(media);

    return (
        <div className="content-container">
            <div className="content-background-overlay"></div>
            <div className="content-detail-container">
                <div className="details-heading-section">
                    {/* Media poster image or placeholder */}
                    <div className="poster">
                        {imagePath != null ? (
                            <img
                                className="item-poster"
                                src={imagePath}
                                alt={media.title || media.name}
                            />
                        ) : (
                            <div className="poster-placeholder">
                                <svg className="icon">
                                    <use xlinkHref={`${sprite}#image-placeholder`} />
                                </svg>
                                <p className="text">Not available</p>
                            </div>
                        )}
                    </div>

                    <div className="right-side">
                        <div className={`media-title ${getMovieTitleClass(mediaTitle)}`}>
                            {mediaTitle}
                        </div>

                        {isMovie ? (
                            // Movie metadata: release year, runtime, rating
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
                            // TV show metadata: air dates, seasons, rating
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

                        {/* Genre tags */}
                        <div className="genre-container">
                            {genreNames.map((name, index) => (
                                <a key={index} className="genre-item">
                                    {name}
                                </a>
                            ))}
                        </div>

                        {/* Rating metrics */}
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

                        {/* Overview section */}
                        <div
                            ref={overviewSection}
                            style={{ display: showOverview ? 'block' : 'none' }}
                            className={`overview ${isExpanded ? 'expanded' : 'collapsed'}`}
                        >
                            <div className="heading">
                                <p className="title">Overview</p>
                                {showExpanderBtn && (
                                    <button
                                        ref={expanderBtnRef}
                                        onClick={() => {
                                            setIsExpanded(!isExpanded);
                                            if (shadowOverlayRef.current) {
                                                shadowOverlayRef.current.style.opacity =
                                                    !isExpanded ? '0' : '1';
                                            }
                                        }}
                                        className={`expander ${isExpanded ? 'expanded' : 'collapsed'}`}
                                    >
                                        <p>Expand</p>
                                        <p>Collapse</p>
                                    </button>
                                )}
                            </div>

                            <p
                                ref={infoRef}
                                className={`info ${isExpanded ? 'expanded' : 'collapsed'}`}
                            >
                                {media.overview}
                            </p>
                            <div ref={shadowOverlayRef} className="shadow-overlay"></div>
                        </div>
                    </div>
                </div>

                {/* Cast section */}
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
