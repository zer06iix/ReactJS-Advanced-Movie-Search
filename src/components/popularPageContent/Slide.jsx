/* eslint-disable no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const Slide = forwardRef(({ slide, posterDetail }, ref) => {
    const imageUrl = slide?.poster_path
        ? `https://image.tmdb.org/t/p/w500${slide.poster_path}`
        : null;

    if (!slide) {
        return null;
    }

    return (
        <div className="carousel-cards">
            {posterDetail ? (
                <Link
                    to={`/movie/${slide?.id}`}
                    onClick={() => console.log(`Navigating to ${slide?.title}`)}
                    ref={ref}
                >
                    <img
                        className="carousel-images"
                        src={imageUrl}
                        alt={slide.title}
                    />
                    <div className="carousel-detail-bg">
                        <p className="carousel-detail-title">
                            {slide.title} ({new Date(slide.release_date).getFullYear()})
                        </p>
                        <p className="carousel-detail-rating">
                            <span className="rating-span">
                                {slide?.vote_average?.toFixed(1)}
                            </span>
                            /10 Rating
                        </p>
                    </div>
                </Link>
            ) : (
                <img src={imageUrl} alt={slide.title} />
            )}
        </div>
    );
});

export default Slide;
