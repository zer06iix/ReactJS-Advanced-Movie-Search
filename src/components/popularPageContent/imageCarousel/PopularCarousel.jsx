/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import NextButton from '../../buttons/NextButton';
import PreviousButton from '../../buttons/PreviousButton';

import PreviousSlide from './PreviousSlide';
import CurrentSlide from './CurrentSlide';
import NextSlide from './NextSlide';

import MouseDownDetector from './MouseDownDetector';
import useCarouselStore from '../../../store/carouselStore';

export default function PopularCarousel({ movies, wrapperRef, upNextWrapperRef }) {
    const transitionLength = 380;
    const currentSlideRef = useRef(null);
    const { prevSlide, currentSlide, nextSlide } = useCarouselStore();
    const [isDragging, setIsDragging] = useState(false);

    const totalSlides = movies.length;
    const prevSlideIndex = Math.max(
        0,
        (currentSlide - 1 + totalSlides) % totalSlides
    );
    const nextSlideIndex = Math.min(
        totalSlides - 1,
        (currentSlide + 1) % totalSlides
    );

    // Click Cooldown
    const [carouselDisabled, setCarouselDisabled] = useState(false);
    const [upNextDisabled, setUpNextDisabled] = useState(false);

    const handleMouseDetectorClick = () => {
        if (currentSlideRef.current) {
            currentSlideRef.current.click();
        }
    };


    const handleCarouselTransition = (direction) => {
        // direction: 1 for next, -1 for prev
        if (carouselDisabled) return;
        setCarouselDisabled(true);

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
            setCarouselDisabled(false);
        }, transitionLength + 20);
    };

    const handleUpNextTransition = (direction) => {
        // direction: 1 for next, -1 for prev
        if (upNextDisabled) return;
        setUpNextDisabled(true);

        const wrapper = upNextWrapperRef.current;
        if (!wrapper) return;

        const firstChild = wrapper.children[0];
        const secondChild = wrapper.children[1];
        const secondLastChild = wrapper.children[wrapper.children.length - 2];
        const lastChild = wrapper.children[wrapper.children.length - 1];

        wrapper.style.transition = `transform ${transitionLength}ms ease`;
        wrapper.style.transform = `translateY(${-direction * 120}px)`;

        switch (direction) {
            case 1:
                secondChild.style.transition = `opacity ${transitionLength}ms ease`;
                secondChild.style.opacity = '0';
                lastChild.style.transition = `opacity ${transitionLength}ms ease`;
                lastChild.style.opacity = '1';
                break;

            case -1:
                secondLastChild.style.transition = `opacity ${transitionLength}ms ease`;
                secondLastChild.style.opacity = '0';
                firstChild.style.transition = `opacity ${transitionLength}ms ease`;
                firstChild.style.opacity = '1';
                break;

            default:
                console.warn('Unexpected direction:', direction);
        }

        setTimeout(() => {
            wrapper.style.transition = 'none';
            wrapper.style.transform = 'translateY(0px)';

            for (let i = 0; i < wrapper.children.length; i++) {
                wrapper.children[i].style.transition = 'none';
                wrapper.children[i].style.opacity = '1';
            }

            if (direction === 1) {
                lastChild.style.opacity = '0';
            }
            if (direction === -1) {
                firstChild.style.opacity = '0';
            }
        }, transitionLength);

        setTimeout(() => {
            setUpNextDisabled(false);
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
                    onClick={() => {
                        handleUpNextTransition(-1);
                        handleCarouselTransition(-1);
                    }}
                    disabled={carouselDisabled}
                />

                <div className="carousel-wrapper" ref={wrapperRef}>
                    <PreviousSlide slide={movies[prevSlideIndex]} />
                    <CurrentSlide slide={movies[currentSlide]} ref={currentSlideRef} />
                    <NextSlide slide={movies[nextSlideIndex]} />
                </div>

                <MouseDownDetector
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onDragLeft={() => {
                        handleUpNextTransition(1);
                        handleCarouselTransition(1);
                    }}
                    onDragRight={() => {
                        handleUpNextTransition(-1);
                        handleCarouselTransition(-1);
                    }}
                    clickCurrentSlide={handleMouseDetectorClick}
                    style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                />

                <NextButton
                    className="carouselBtns nextBtn"
                    onClick={() => {
                        handleUpNextTransition(1);
                        handleCarouselTransition(1);
                    }}
                    disabled={carouselDisabled}
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
