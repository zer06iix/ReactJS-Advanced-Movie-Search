/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import Slide from '../Slide';

const UpNextItem = ({
    movie,
    genreMap,
    creditsData,
    creditsLoading,
    creditsError,
    translateY
}) => {
    const isLoading = creditsLoading[movie?.id] || false;
    const isError = creditsError[movie?.id] || false;

    if (isLoading) {
        return (
            <div
                className="up-next-item"
                style={{ transform: `translateY(${translateY}%)` }}
            >
                Loading credits...
            </div>
        );
    }

    if (isError) {
        return (
            <div
                className="up-next-item"
                style={{ transform: `translateY(${translateY}%)` }}
            >
                Error loading credits: {creditsError[movie?.id]?.message}
            </div>
        );
    }

    const titleWithYear = `${movie.title} (${new Date(movie.release_date).getFullYear()})`;
    const director = creditsData[movie?.id]?.crew?.find(
        (member) => member.job === 'Director'
    );
    const directorName = director ? director.name : 'Director not found';

    const slideGenres = movie.genre_ids.slice(0, 3).map((id) => (
        <div className="genre-item" key={id}>
            {genreMap[id] || 'Unknown Genre'}
        </div>
    ));

    return (
        <div
            className="up-next-item"
            style={{ transform: `translateY(${translateY}%)` }}
        >
            <div className="poster">
                <Slide slide={movie} posterDetail={false} />
            </div>

            <div className="right-side">
                <div className="heading">
                    <p className="title">{titleWithYear}</p>
                    {titleWithYear.length < 30 && ( // only if there was enough room
                        <p className="director-name">Directed by {directorName}</p>
                    )}
                </div>

                <div className="genres-container">
                    {slideGenres.length > 0 ? (
                        slideGenres
                    ) : (
                        <div>Genre not available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpNextItem;
