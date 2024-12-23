import { useRef, useState, useEffect } from 'react';
import useMovieStore from '../../../store/movieStore';
import CastItem from './CastItem';

export default function CastScroller() {
    const { credits } = useMovieStore();
    const wrapperRef = useRef(null);
    const containerRef = useRef(null); // Reference for the container
    const [translateX, setTranslateX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [maxTranslateX, setMaxTranslateX] = useState(0); // State for max translate

    useEffect(() => {
        if (wrapperRef.current && containerRef.current) {
            const wrapperWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            const maxX = containerWidth - wrapperWidth;
            setMaxTranslateX(maxX); // Set max translateX
            setTranslateX(Math.max(Math.min(translateX, 0), maxX)); // Constrain translateX
        }
    }, [credits, translateX]); // Recalculate when credits change

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    useEffect(() => {
        // Log when at the beginning or end
        if (translateX === 0) {
            console.log('Drag is at the beginning');
        } else if (translateX === maxTranslateX) {
            console.log('Drag is at the end');
        }
    }, [translateX, maxTranslateX]); // Depend on translateX and maxTranslateX

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        setTranslateX((prev) => Math.max(Math.min(prev + deltaX, 0), maxTranslateX)); // Constrain during drag
        setStartX(e.clientX);
    };

    const shadowOverlayOpacityStart =
        translateX === maxTranslateX ? 1 : translateX === 0 ? 0 : 1;
    const shadowOverlayOpacityEnd =
        translateX === 0 ? 1 : translateX === maxTranslateX ? 0 : 1;

    return (
        <div className="cast-scroller-container" ref={containerRef}>
            <div
                className="sahdow-overlay sahdow-overlay-start"
                style={{ opacity: shadowOverlayOpacityStart }}
            ></div>
            <div
                className="cast-scroller-wrapper"
                ref={wrapperRef}
                style={{ transform: `translateX(${translateX}px)` }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
            >
                {credits && credits.cast && credits.cast.length > 0
                    ? credits.cast.map((member) => (
                          <CastItem member={member} key={member.id} />
                      ))
                    : null}
            </div>
            <div
                className="sahdow-overlay sahdow-overlay-end"
                style={{ opacity: shadowOverlayOpacityEnd }}
            ></div>
        </div>
    );
}
