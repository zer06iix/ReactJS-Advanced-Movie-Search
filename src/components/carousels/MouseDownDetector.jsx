import { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const MouseDownDetector = ({ onMouseUp, onMouseLeave, onDragLeft, onDragRight }) => {
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const divRef = useRef(null);

    const handleMouseDown = useCallback((e) => {
        setStartX(e.clientX);
        setStartY(e.clientY);
        setIsDragging(true);
        document.body.style.cursor = 'grabbing';
    }, []);

    const handleMouseMove = useCallback(() => {
        // Dragging logic can be added here if needed
    }, []);

    const handleMouseUp = useCallback((e) => {
        if (!isDragging) return;

        const endX = e.clientX;
        const endY = e.clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        // Check if the movement was more horizontal than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                // Dragged Right
                if (onDragRight) onDragRight();
            } else {
                // Dragged Left
                if (onDragLeft) onDragLeft();
            }
        }

        setIsDragging(false);
        document.body.style.cursor = '';
        if (onMouseUp) onMouseUp();
    }, [isDragging, onMouseUp, onDragLeft, onDragRight, startX, startY]);

    const handleMouseLeave = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);
            document.body.style.cursor = '';
            if (onMouseLeave) onMouseLeave();
        }
    }, [isDragging, onMouseLeave]);

    useEffect(() => {
        const detectorDivBound = divRef.current;
        if (!detectorDivBound) return;

        detectorDivBound.addEventListener('mousedown', handleMouseDown);
        detectorDivBound.addEventListener('mousemove', handleMouseMove);
        detectorDivBound.addEventListener('mouseup', handleMouseUp);
        detectorDivBound.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            detectorDivBound.removeEventListener('mousedown', handleMouseDown);
            detectorDivBound.removeEventListener('mousemove', handleMouseMove);
            detectorDivBound.removeEventListener('mouseup', handleMouseUp);
            detectorDivBound.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleMouseLeave]);

    return (
        <div ref={divRef} className="mouse-down-detector" />
    );
};

MouseDownDetector.propTypes = {
    onMouseUp: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onDragLeft: PropTypes.func,
    onDragRight: PropTypes.func,
};

export default MouseDownDetector;
