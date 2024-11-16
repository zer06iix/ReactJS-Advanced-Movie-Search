/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import NextButton from '../../buttons/NextButton';
import PreviousButton from '../../buttons/PreviousButton';

import PreviousSlide from './PreviousSlide';
import CurrentSlide from './CurrentSlide';
import NextSlide from './NextSlide';

import useCarouselStore from '../../../store/carouselStore';

export default function PopularCarousel({ movies, wrapperRef, upNextWrapperRef }) {
    const { prevSlide, currentSlide, nextSlide } = useCarouselStore();
    const transitionLength = 330;

    const totalSlides = movies.length;
    const prevSlideIndex = Math.max(
        0,
        (currentSlide - 1 + totalSlides) % totalSlides
    );
    const nextSlideIndex = Math.min(
        totalSlides - 1,
        (currentSlide + 1) % totalSlides
    );

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleCarouselTransition = (direction) => {
        // direction: 1 for next, -1 for prev
        if (isButtonDisabled) return;
        setIsButtonDisabled(true);

        const wrapper = wrapperRef.current;
        wrapper.style.transition = `transform ${transitionLength}ms ease`;
        wrapper.style.transform = `translateX(${direction * -100}%)`;

        setTimeout(() => {
            wrapper.style.transition = 'none';
            wrapper.style.transform = 'translateX(0%)';
            direction === 1 ? nextSlide() : prevSlide();
            setIsDragging(true);
            setTimeout(() => {
                wrapper.style.transition = `transform ${transitionLength}ms ease`;
                setIsDragging(false);
            }, 20);
        }, transitionLength);

        setTimeout(() => {
            setIsButtonDisabled(false);
        }, transitionLength + 20);
    };

    const handleUpNextTransition = (direction) => {
        // direction: 1 for next, -1 for prev
        const wrapper = upNextWrapperRef.current;
        if (!wrapper) return;

        wrapper.style.transition = `transform ${transitionLength}ms ease`;
        wrapper.style.transform = `translateY(${-direction * 120}px)`;

        // if (direction === 1) {
        //     wrapper.children[1].style.opacity = '0';
        //     wrapper.children[wrapper.children.length - 1].style.opacity = '0'
        // } else if (direction === -1) {
        //     wrapper.children[].style.opacity = '0';
        //     wrapper.lastElementChild.style.opacity = '1'
        // }

        setTimeout(() => {
            wrapper.style.transition = 'none';
            wrapper.style.transform = 'translateY(0px)';

            if (direction === 1) {
                wrapper.children[1].style.opacity = '1';
            }
        }, transitionLength);
    };

    useEffect(() => {
        setIsDragging(false);
    }, [currentSlide]);

    return (
        <div className="carousel-container">
            <div className="carousel-mask">
                <PreviousButton
                    className="carouselBtns prevBtn"
                    onClick={() => {
                        handleUpNextTransition(-1);
                        handleCarouselTransition(-1);
                    }}
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
                    onClick={() => {
                        handleUpNextTransition(1);
                        handleCarouselTransition(1);
                    }}
                    disabled={isButtonDisabled}
                />
            </div>
        </div>
    );
}

PopularCarousel.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    wrapperRef: PropTypes.object.isRequired,
    upNextWrapperRef: PropTypes.object.isRequired
};
