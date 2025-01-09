import { useRef, useEffect } from 'react';
import useShowStore from '../../../stores/showStore';
import useScrollerStore from '../../../stores/scrollerStore';
import CastItem from '../../contentPage/cast/CastItem';

export default function ShowsCastScroller() {
    const { showsCredits } = useShowStore();
    const wrapperRef = useRef(null); // Reference for the wrapper
    const containerRef = useRef(null); // Reference for the container
    const { 
        translateX, 
        setTranslateX, 
        isDragging,
        setIsDragging,
        setStartX, 
        maxTranslateX, 
        setMaxTranslateX
    } = useScrollerStore();

    useEffect(() => {
        if (wrapperRef.current && containerRef.current) {
            const wrapperWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            const maxX = wrapperWidth - containerWidth;
            setMaxTranslateX(-maxX); // Set max translateX
            setTranslateX(Math.max(Math.min(translateX, 0), -maxX)); // Constrain translateX
        }
    }, [showsCredits, translateX, setMaxTranslateX, setTranslateX]); // Recalculate when credits change

    useEffect(() => {
        const handleMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [setIsDragging]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;
            const deltaX = e.movementX;
            setTranslateX(Math.max(Math.min(translateX + deltaX, 0), maxTranslateX));
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isDragging, maxTranslateX, translateX, setTranslateX])

    const shadowOverlayOpacityStart =
        translateX === maxTranslateX ? 1 : translateX === 0 ? 0 : 1;
    const shadowOverlayOpacityEnd =
        translateX === 0 ? 1 : translateX === maxTranslateX ? 0 : 1;

    return (
        <div
            className="cast-scroller-container"
            ref={containerRef}
            // onWheel={handleWheel}
        >
            <div
                className="cast-scroller-container"
                ref={containerRef}
                // onWheel={handleWheel}
            >
                <div
                    className="shadow-overlay shadow-overlay-start"
                    style={{ opacity: shadowOverlayOpacityStart }}
                ></div>
                <div
                    className="cast-scroller-wrapper"
                    ref={wrapperRef}
                    style={{ transform: `translateX(${translateX}px)` }}
                    onMouseDown={handleMouseDown}
                >
                {showsCredits && showsCredits.cast && showsCredits.cast.length > 0
                    ? showsCredits.cast.map((member) => (
                    <CastItem member={member} key={member.id} />
                    ))
                    : null}
                </div>
                <div
                    className="shadow-overlay shadow-overlay-end"
                    style={{ opacity: shadowOverlayOpacityEnd }}
                ></div>
            </div>
        </div>
    );
}