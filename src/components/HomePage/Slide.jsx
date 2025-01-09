/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import VoteAverage from './imageCarousel/VoteAverage';

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
                            {slide.title} (
                            {new Date(slide.release_date).getFullYear()})
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
                <img src={imageUrl} alt={slide.title} />
            )}
        </div>
    );
});

export default Slide;
