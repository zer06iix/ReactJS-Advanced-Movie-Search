// src/components/ImageCarousel.js
import React, { useEffect, useState } from 'react';

const ImageCarousel = () => {
  const [imageCarouselIndex, setImageCarouselIndex] = useState(0);
  const [carouselElements, setCarouselElements] = useState({
    track: null,
    cards: [],
    prevBtn: null,
    nextBtn: null
  });

  useEffect(() => {
    const track = document.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    setCarouselElements({ track, cards, prevBtn, nextBtn });
  }, []);

  const getCarouselSlides = (track) => {
    const currentSlideCenter = track.querySelector('.current-slide-center');
    const currentSlideRight = track.querySelector('.current-slide-right');
    const currentSlideLeft = track.querySelector('.current-slide-left');
    const hiddenSlidesRight = track.querySelectorAll('.hidden-slide-right');
    const hiddenSlidesLeft = track.querySelectorAll('.hidden-slide-left');

    return {
      currentSlideCenter,
      currentSlideRight,
      currentSlideLeft,
      hiddenSlidesRight,
      hiddenSlidesLeft,
    };
  };

  const transitionVisibleSlides = (slide, size) => {
    const fullContainer = slide.querySelector('.carousel-slide-full-container');
    const detailSection = slide.querySelector('.detail');

    if (size === 'large') {
      fullContainer.style.opacity = '1';
      detailSection.style.opacity = '1';
      detailSection.style.transform = 'translate(0, 0%)';
    } else {
      fullContainer.style.opacity = '0';
      detailSection.style.opacity = '0';
      detailSection.style.transform = 'translate(0, 100%)';
    }
  };

  const replaceClasses = (element, ...classNames) => {
    element.className = '';
    classNames.forEach(className => {
      element.classList.add(className);
    });
  };

  const handlePrevClick = () => {
    const { track, cards } = carouselElements;
    const {
      currentSlideCenter,
      currentSlideRight,
      currentSlideLeft,
      hiddenSlidesRight,
      hiddenSlidesLeft
    } = getCarouselSlides(track);

    transitionVisibleSlides(currentSlideCenter, 'small');
    transitionVisibleSlides(currentSlideLeft, 'large');

    replaceClasses(currentSlideCenter, 'carousel-slides', 'current-slide-right');
    replaceClasses(currentSlideRight, 'carousel-slides', 'hidden-slides', 'hidden-slide-right');
    replaceClasses(currentSlideLeft, 'carousel-slides', 'current-slide-center');
    replaceClasses(hiddenSlidesRight[0], 'carousel-slides', 'hidden-slides', 'hidden-slide-left');
    replaceClasses(hiddenSlidesLeft[hiddenSlidesLeft.length - 1], 'carousel-slides', 'current-slide-left');

    setImageCarouselIndex((imageCarouselIndex === 0) ? (cards.length - 1) : (imageCarouselIndex - 1));
  };

  const handleNextClick = () => {
    const { track, cards } = carouselElements;
    const {
      currentSlideCenter,
      currentSlideRight,
      currentSlideLeft,
      hiddenSlidesRight,
      hiddenSlidesLeft
    } = getCarouselSlides(track);

    transitionVisibleSlides(currentSlideCenter, 'small');
    transitionVisibleSlides(currentSlideRight, 'large');

    replaceClasses(currentSlideCenter, 'carousel-slides', 'current-slide-left');
    replaceClasses(currentSlideRight, 'carousel-slides', 'current-slide-center');
    replaceClasses(currentSlideLeft, 'carousel-slides', 'hidden-slides', 'hidden-slide-left');
    replaceClasses(hiddenSlidesRight[0], 'carousel-slides', 'current-slide-right');
    replaceClasses(hiddenSlidesLeft[hiddenSlidesLeft.length - 1], 'carousel-slides', 'hidden-slides', 'hidden-slide-right');

    setImageCarouselIndex((imageCarouselIndex === cards.length - 1) ? 0 : (imageCarouselIndex + 1));
  };

  return (
    <div className="carousel-container">
      <button className="prev-btn" onClick={handlePrevClick}>Prev</button>
      <div className="carousel-track">
        {/* Render your carousel slides here */}
      </div>
      <button className="next-btn" onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default ImageCarousel;