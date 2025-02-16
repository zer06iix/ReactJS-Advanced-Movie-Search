/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import VoteAverage from './imageCarousel/VoteAverage';

const Slide = forwardRef(({ slide, posterDetail }, ref) => {
    const mediaType = slide?.name ? 'shows': 'movie';
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
                    to={`/${mediaType}/${slide?.id}`}
                    onClick={() => console.log(`Navigating to ${slide?.title || slide?.name}`)}
                    ref={ref}
                >
                    <img
                        className="carousel-images"
                        src={imageUrl}
                        alt={slide?.title || slide?.name}
                    />
                    <div className="carousel-detail-bg">
                        <p className="carousel-detail-title">
                            {slide?.title || slide?.name} (
                            {mediaType === 'shows'
                                ? slide.in_production
                                    ? `Since ${slide.first_air_date ? new Date(slide.first_air_date).getFullYear() : 'N/A'}`
                                    : `${slide.first_air_date ? `${new Date(slide.first_air_date).getFullYear()}` : 'N/A'} - ${slide.last_air_date ? new Date(slide.last_air_date).getFullYear() : 'N/A'}`
                                : slide.release_date ? new Date(slide.release_date).getFullYear() : 'N/A'}
                            )
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <VoteAverage voteAverage={slide.vote_average} />
                            <span style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                                /10 Rating
                            </span>
                        </div>
                    </div>
                </Link>
            ) : (
                <img src={imageUrl} alt={slide?.title || slide?.name} />
            )}
        </div>
    );
});

export default Slide;
