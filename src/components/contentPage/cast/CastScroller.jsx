import { useRef, useState, useCallback, useEffect } from 'react';
import useMovieStore from '../../../stores/movieStore';
import useShowStore from '../../../stores/showStore';
import CastItem from '../../contentPage/cast/CastItem';

import NextButton from '../../buttons/NextButton';
import PreviousButton from '../../buttons/PreviousButton';

export default function CastScroller() {
    const { movieCredits } = useMovieStore();
    const { shows, showsCredits } = useShowStore();
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const [translateX, setTranslateX] = useState(0);
    const [isScrollEnd, setIsScrollEnd] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false); // Track if scrolling is in progress

    const mediaType = shows?.name ? 'shows' : 'movie';

    const scrollStep = 600;
    const scrollDelay = 500; // Set the delay in milliseconds

    const scrollLeft = useCallback(() => {
        if (wrapperRef.current && !isScrolling) {
            setIsScrolling(true);
            setTranslateX((prevTranslateX) => Math.min(0, prevTranslateX + scrollStep));
            setTimeout(() => {
                setIsScrolling(false);
            }, scrollDelay);
        }
    }, [scrollStep, isScrolling, scrollDelay]); // Added isScrolling and scrollDelay to dependencies

    const scrollRight = useCallback(() => {
        if (wrapperRef.current && containerRef.current && !isScrolling) {
            setIsScrolling(true);
            const containerWidth = containerRef.current.offsetWidth;
            const contentWidth = wrapperRef.current.offsetWidth;
            setTranslateX((prevTranslateX) =>
                Math.max(-(contentWidth - containerWidth), prevTranslateX - scrollStep)
            );
            setTimeout(() => {
                setIsScrolling(false);
            }, scrollDelay);
        }
    }, [scrollStep, isScrolling, scrollDelay]); // Added isScrolling and scrollDelay to dependencies

    useEffect(() => {
        if (wrapperRef.current && containerRef.current) {
            setIsInitialLoad(false);
            const contentWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            setIsScrollEnd(translateX <= -(contentWidth - containerWidth));
        }
    }, [translateX]);

    useEffect(() => {
        if (!isInitialLoad && wrapperRef.current && containerRef.current) {
            const contentWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            setIsScrollEnd(translateX <= -(contentWidth - containerWidth));
        }
    }, [isInitialLoad]);

    return (
        <div className="cast-scroller-container" ref={containerRef}>
            <div className="cast-scroller-inner">
                <div
                    className="shadow-overlay shadow-overlay-start"
                    style={{ opacity: translateX !== 0 ? 1 : 0 }}
                >
                    <PreviousButton
                        className="carouselBtns prevBtn"
                        onClick={scrollLeft}
                        disabled={translateX === 0 || isScrolling} // Disable when at the start or scrolling
                    />
                </div>
                <div
                    className="cast-scroller-wrapper"
                    ref={wrapperRef}
                    style={{
                        transform: `translateX(${translateX}px)`,
                        transition: 'transform 0.5s ease-in-out'
                    }}
                >
                    {mediaType == 'movie'
                        ? movieCredits &&
                          movieCredits.cast &&
                          movieCredits.cast.length > 0
                            ? movieCredits.cast.map((member) => (
                                  <CastItem member={member} key={member.id} />
                              ))
                            : null
                        : showsCredits &&
                            showsCredits.cast &&
                            showsCredits.cast.length > 0
                          ? showsCredits.cast.map((member) => (
                                <CastItem member={member} key={member.id} />
                            ))
                          : null}
                </div>
                <div
                    className="shadow-overlay shadow-overlay-end"
                    style={{
                        opacity:
                            !isInitialLoad &&
                            wrapperRef.current &&
                            containerRef.current &&
                            translateX >
                                -(
                                    wrapperRef.current.offsetWidth -
                                    containerRef.current.offsetWidth
                                )
                                ? 1
                                : 0
                    }}
                >
                    <NextButton
                        className="carouselBtns nextBtn"
                        onClick={scrollRight}
                        disabled={
                            (!isInitialLoad && wrapperRef.current && containerRef.current
                                ? translateX <=
                                  -(
                                      wrapperRef.current.offsetWidth -
                                      containerRef.current.offsetWidth
                                  )
                                : true) || isScrolling // Disable when at the end or scrolling
                        }
                    />
                </div>
            </div>
        </div>
    );
}
