/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import Loading from '../components/app/Loading';

import CastScroller from '../components/contentPage/cast/CastScroller';
import useContentStore from '../stores/contentStore';

import MediaExpandable from '../components/contentPage/MediaExpandable';
import MovieMeta from '../components/moviePage/MovieMeta';
import ShowsMeta from '../components/showsPage/ShowsMeta';
import MediaGenre from '../components/contentPage/MediaGenre';
import MediaRating from '../components/contentPage/MediaRating';
import MediaPoster from '../components/contentPage/MediaPoster';
import sprite from '../styles/sprite.svg';
import { ReactSVG } from 'react-svg';

const ContentTemplate = ({ type, media, creditsData, genresMap }) => {
    const isMovie = type === 'Movie' ? true : false;
    const mediaTitle = isMovie ? media.title : media.name;
    const showFormattedDate = !isMovie ? (
        media.in_production ? (
            <span title={new Date(media.first_air_date).toLocaleDateString('en-GB')}>
                Since {media.first_air_date.slice(0, 4)}
            </span>
        ) : (
            <>
                <span title={new Date(media.first_air_date).toLocaleDateString('en-GB')}>
                    {media.first_air_date.slice(0, 4)}
                </span>{' '}
                -{' '}
                <span title={new Date(media.last_air_date).toLocaleDateString('en-GB')}>
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
                        />

                        {/* Overview section */}
                        <MediaExpandable
                            titleText="Overview"
                            content={media.overview}
                            expanderText={['Expand', 'Collapse']}
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
