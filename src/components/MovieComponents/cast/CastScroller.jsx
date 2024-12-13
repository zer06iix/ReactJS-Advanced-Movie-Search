import React, { useRef, useState, useEffect } from 'react';
import useMovieStore from '../../../store/movieStore';
import CastItem from './CastItem';

export default function CastScroller() {
    const { credits } = useMovieStore();
    const wrapperRef = useRef(null);
    const containerRef = useRef(null); // Reference for the container
    const [translateX, setTranslateX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    useEffect(() => {
        if (wrapperRef.current && containerRef.current) {
            const wrapperWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            const maxTranslateX = containerWidth - wrapperWidth;
            setTranslateX(Math.max(Math.min(translateX, 0), maxTranslateX)); //constrain translateX
        }

        // if (translateX === 0) {
        //     console.log("Drag is at the beginning");
        // }
        // if (translateX === maxTranslateX) {
        //     console.log("Drag is at the end");
        // }
    }, [translateX]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        setTranslateX(translateX + deltaX);
        setStartX(e.clientX);
    };

    return (
        <div className="cast-scroller-container" ref={containerRef}>
            {' '}
            {/*Added ref to container*/}
            <div className="sahdow-overlay sahdow-overlay-start"></div>
            <div
                className="cast-scroller-wrapper"
                ref={wrapperRef}
                style={{ transform: `translateX(${translateX}px)` }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                {credits && credits.cast && credits.cast.length > 0 ? (
                    credits.cast.map((member) => (
                        <CastItem member={member} key={member.id} />
                    ))
                ) : (
                    <p>No cast information available.</p>
                )}
            </div>
            <div className="sahdow-overlay sahdow-overlay-end"></div>
        </div>
    );
}
