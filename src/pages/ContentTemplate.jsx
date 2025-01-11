/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import Loading from '../components/app/Loading';

import CastScroller from '../components/contentPage/cast/CastScroller';

import MediaOverview from '../components/contentPage/MediaOverview';
import MovieMeta from '../components/moviePage/MovieMeta';
import ShowsMeta from '../components/showsPage/ShowsMeta';
import MediaGenre from '../components/contentPage/MediaGenre';
import MediaRating from '../components/contentPage/MediaRating';
import MediaPoster from '../components/contentPage/MediaPoster';
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
                    setShowExpanderBtn(false);
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
    const showFormattedDate = !isMovie
        ? media.in_production
            ? `Since ${media.first_air_date.slice(0, 4)}`
            : `${media.first_air_date.slice(0, 4)} – ${media.last_air_date.slice(0, 4)}`
        : null;

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

    return (
        <div className="content-container">
            <div className="content-background-overlay"></div>
            <div className="content-detail-container">
                <div className="details-heading-section">
                    {/* Media poster image or placeholder */}
                    <MediaPoster imagePath={imagePath} mediaTitle={mediaTitle} />

                    <div className="right-side">
                        <div className={`media-title ${getMovieTitleClass(mediaTitle)}`}>
                            {mediaTitle}
                        </div>

                        {isMovie ? (
                            // Movie metadata: release year, runtime, rating
                            <MovieMeta
                                releaseDate={media.release_date}
                                adult={media.adult}
                                ratingTitle={ratingTitle}
                                formattedRating={formattedRating}
                                formattedRuntime={formattedRuntime}
                            />
                        ) : (
                            // TV show metadata: air dates, seasons, rating
                            <ShowsMeta
                                showFormattedDate={showFormattedDate}
                                seasonsCount={media.seasons.length}
                                adult={media.adult}
                                ratingTitle={ratingTitle}
                                formattedRating={formattedRating}
                            />
                        )}

                        {/* Genre tags */}
                        <MediaGenre genreNames={genreNames} />

                        {/* Rating metrics */}
                        <MediaRating
                            voteAverage={media.vote_average}
                            voteCount={media.vote_count}
                            popularity={media.popularity}
                            sprite={sprite} // Pass the sprite prop to MediaRating
                        />

                        {/* Overview section */}
                        <MediaOverview
                            media={media}
                            showOverview={showOverview}
                            isExpanded={isExpanded}
                            setIsExpanded={setIsExpanded}
                            showExpanderBtn={showExpanderBtn}
                            overviewSection={overviewSection}
                            expanderBtnRef={expanderBtnRef}
                            infoRef={infoRef}
                            shadowOverlayRef={shadowOverlayRef}
                        />
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

                        <CastScroller />
                    </div>
                )}
            </div>

            <ReactSVG src={sprite} style={{ display: 'none' }} />
        </div>
    );
};

export default ContentTemplate;
