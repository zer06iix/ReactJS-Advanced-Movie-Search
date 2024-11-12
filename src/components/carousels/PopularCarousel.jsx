import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import NextButton from '../buttons/NextButton';
import PreviousButton from '../buttons/PreviousButton';

import PreviousSlide from './imageCarousel/PreviousSlide';
import CurrentSlide from './imageCarousel/CurrentSlide';
import NextSlide from './imageCarousel/NextSlide';

import MouseDownDetector from './imageCarousel/MouseDownDetector';
import useCarouselStore from '../../store/carouselStore';

export default function PopularCarousel({ movies }) {
    const { prevSlide, currentSlide, nextSlide } = useCarouselStore();
    const wrapperRef = useRef(null);

    const totalSlides = movies.length;
    const prevSlideIndex = Math.max(
        0,
        (currentSlide - 1 + totalSlides) % totalSlides
    );
    const nextSlideIndex = Math.min(
        totalSlides - 1,
        (currentSlide + 1) % totalSlides
    );
    const transitionLength = 330;

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleTransition = (direction) => {
        // direction: 1 for next, -1 for prev
        if (isButtonDisabled) return;
        setIsButtonDisabled(true);

        const wrapper = wrapperRef.current;
        wrapper.style.transition = `transform ${transitionLength / 1000}s ease`;
        wrapper.style.transform = `translateX(${direction * -100}%)`;

        setTimeout(() => {
            wrapper.style.transition = 'none';
            wrapper.style.transform = 'translateX(0%)';
            direction === 1 ? nextSlide() : prevSlide();
            setIsDragging(true);
            setTimeout(() => {
                wrapper.style.transition = `transform ${transitionLength / 1000}s ease`;
                setIsDragging(false);
            }, 20);
        }, transitionLength);

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, transitionLength + 20);
    };

    useEffect(() => {
        setIsDragging(false);
    }, [currentSlide]);

    return (
        <div className="carousel-container">
            <div className="carousel-mask">
                <PreviousButton
                    className="carouselBtns prevBtn"
                    onClick={() => handleTransition(-1)}
                    disabled={isButtonDisabled}
                />

                <div className="carousel-wrapper" ref={wrapperRef}>
                    <PreviousSlide slide={movies[prevSlideIndex]} />
                    <CurrentSlide slide={movies[currentSlide]} />
                    <NextSlide slide={movies[nextSlideIndex]} />
                </div>

                {/* <MouseDownDetector
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onDragLeft={() => handleTransition(1)}
                    onDragRight={() => handleTransition(-1)}
                    style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                /> */}

                <NextButton
                    className="carouselBtns nextBtn"
                    onClick={() => handleTransition(1)}
                    disabled={isButtonDisabled}
                />

                {/* <UpNextSection className="up-next-section" /> */}
            </div>
        </div>
    );
}

PopularCarousel.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired
};
