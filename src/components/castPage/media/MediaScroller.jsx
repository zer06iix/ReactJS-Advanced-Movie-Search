/* eslint-disable no-unused-vars */
import { useRef, useState, useCallback, useEffect } from 'react';
import useCastStore from '../../../stores/castStore';

import MediaItem from './MediaItem';

import NextButton from '../../buttons/NextButton';
import PreviousButton from '../../buttons/PreviousButton';

export default function MediaScroller() {
    const { castCredits } = useCastStore();
    
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const [translateX, setTranslateX] = useState(0);
    const [isScrollEnd, setIsScrollEnd] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const scrollStep = 600;
    const scrollDelay = 500;

    const scrollLeft = useCallback(() => {
        if (wrapperRef.current && !isScrolling) {
            setIsScrolling(true);
            setTranslateX((prevTranslateX) => Math.min(0, prevTranslateX + scrollStep));
            setTimeout(() => {
                setIsScrolling(false);
            }, scrollDelay);
        }
    }, [scrollStep, isScrolling, scrollDelay, setIsScrolling, setTranslateX]);

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
    }, [scrollStep, isScrolling, scrollDelay, setIsScrolling, setTranslateX]);

    useEffect(() => {
        if (wrapperRef.current && containerRef.current) {
            setIsInitialLoad(false);
            const contentWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            setIsScrollEnd(translateX <= -(contentWidth - containerWidth));
        }
    }, [translateX, setIsInitialLoad, setIsScrollEnd]);

    useEffect(() => {
        if (!isInitialLoad && wrapperRef.current && containerRef.current) {
            const contentWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            setIsScrollEnd(translateX <= -(contentWidth - containerWidth));
        }
    }, [isInitialLoad, translateX, setIsScrollEnd]);

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
                        disabled={translateX === 0}
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
                    {castCredits &&
                        castCredits.cast &&
                        castCredits.cast.length > 0
                        ? castCredits.cast.map((media) => (
                                <MediaItem media={media} key={media.id} />
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
                            !isInitialLoad && wrapperRef.current && containerRef.current
                                ? translateX <=
                                    -(
                                        wrapperRef.current.offsetWidth -
                                        containerRef.current.offsetWidth
                                    )
                                : true
                        }
                    />
                </div>
            </div>
        </div>
    );
}
