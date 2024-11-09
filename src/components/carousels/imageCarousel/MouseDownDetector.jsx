/* eslint-disable no-unused-vars */
import { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

const MouseDownDetector = ({ onMouseUp, onMouseLeave, onDragLeft, onDragRight }) => {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const divRef = useRef(null);

  const handleStart = useCallback((e) => {
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;
    setStartX(clientX);
    setStartY(clientY);
    setIsDragging(true);
    // Set cursor style using state (not applicable for touch, but can be used for visual feedback)
    if (divRef.current) {
      divRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handleMove = useCallback(
    (e) => {
      if (!isDragging) return;
      // Dragging logic can be added here if needed
    },
    [isDragging]
  );

  const handleEnd = useCallback(
    (e) => {
      if (!isDragging) return;

      const clientX = e.changedTouches[0].clientX;
      const clientY = e.changedTouches[0].clientY;
      const deltaX = clientX - startX;
      const deltaY = clientY - startY;

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
      // Reset cursor style using state (not applicable for touch)
      if (divRef.current) {
        divRef.current.style.cursor = '';
      }
      if (onMouseUp) onMouseUp();
    },
    [isDragging, onMouseUp, onDragLeft, onDragRight, startX, startY]
  );

  const handleTouchMove = useCallback((e) => handleMove(e), [handleMove]);
  const handleTouchEnd = useCallback((e) => handleEnd(e), [handleEnd]);

  const handleTouchLeave = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Reset cursor style using state (not applicable for touch)
      if (divRef.current) {
        divRef.current.style.cursor = '';
      }
      if (onMouseLeave) onMouseLeave();
    }
  }, [isDragging, onMouseLeave]);

  return (
    <div
      ref={divRef}
      className="mouse-down-detector"
      onTouchStart={handleStart}
      onTouchMove={isDragging ? handleTouchMove : undefined}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchLeave} // Handle touch cancel
    />
  );
};

MouseDownDetector.propTypes = {
  onMouseUp: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onDragLeft: PropTypes.func,
  onDragRight: PropTypes.func
};

export default MouseDownDetector;
