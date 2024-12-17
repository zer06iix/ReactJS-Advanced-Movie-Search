import React, { useEffect, useRef, useState } from 'react';

// Configuration object with default settings
const DEFAULT_CONFIG = {
    enableArrowBtns: true,
    arrowBtnsColor: 'red',
    arrowBtnsLength: 20, //px
    hideArrowBtnsWhenInactive: true,
    arrowBtnsToggleDelay: 500, //ms
    trackThickness: 20,
    thumbThickness: 20,
    thumbLength: {
        mode: 'relevant', // can be 'static' or 'relevant'
        value: 75 // px when mode is 'static'
    }
};

function CustomScrollbar({ x = false, y = false, config = {} }) {
    // Merge default config with user-provided config
    const scrollConfig = {
        ...DEFAULT_CONFIG,
        ...config,
        thumbLength: {
            ...DEFAULT_CONFIG.thumbLength,
            ...(config.thumbLength || {})
        }
    };

    // To track active/inactive state
    const [isActive, setIsActive] = useState(true);
    const scrollbarRef = useRef(null);
    const mouseLeaveTimerRef = useRef(null);

    // Update CSS custom property when component mounts or config changes
    useEffect(() => {
        document.documentElement.style.setProperty(
            '--arrow-btns-length',
            `${scrollConfig.arrowBtnsLength}px`
        );
    }, [scrollConfig.arrowBtnsLength]);

    const [thumbPosition, setThumbPosition] = useState(0);
    const isDragging = useRef(false);
    const trackRef = useRef(null);

    // Mouse Handlers

    // Mouse event handlers for thumb movement
    const createMouseHandlers = () => {
        const handleMouseDown = (e) => {
            e.preventDefault();
            isDragging.current = true;
            document.body.style.userSelect = 'none';
        };

        const handleMouseUp = () => {
            isDragging.current = false;
            document.body.style.userSelect = '';
        };

        const handleMouseMove = (e) => {
            if (!isDragging.current || !trackRef.current) return;

            const rect = trackRef.current.getBoundingClientRect();
            let thumbLength;

            if (scrollConfig.thumbLength.mode === 'static') {
                thumbLength = scrollConfig.thumbLength.value;
            } else {
                thumbLength = x ? rect.width * 0.5 : rect.height * 0.5;
            }

            let newPosition;

            if (y) {
                const offsetY = e.clientY - rect.top;
                newPosition = Math.min(
                    Math.max(0, offsetY - thumbLength / 2),
                    rect.height - thumbLength
                );
            } else if (x) {
                const offsetX = e.clientX - rect.left;
                newPosition = Math.min(
                    Math.max(0, offsetX - thumbLength / 2),
                    rect.width - thumbLength
                );
            }

            setThumbPosition(newPosition || 0);
        };

        return { handleMouseDown, handleMouseUp, handleMouseMove };
    };

    const { handleMouseDown, handleMouseUp, handleMouseMove } =
        createMouseHandlers();

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Mouse event handlers for tracking cursor
    useEffect(() => {
        if (!scrollConfig.hideArrowBtnsWhenInactive) return;

        const handleMouseEnter = () => {
            // Clear any pending timeout
            if (mouseLeaveTimerRef.current) {
                clearTimeout(mouseLeaveTimerRef.current);
            }
            setIsActive(true);
        };

        const handleMouseLeave = () => {
            // Set a timeout to allow for potential re-entry
            mouseLeaveTimerRef.current = setTimeout(() => {
                setIsActive(false);
            }, scrollConfig.arrowBtnsToggleDelay);
        };

        const scrollbarElement = scrollbarRef.current;
        if (scrollbarElement) {
            scrollbarElement.addEventListener('mouseenter', handleMouseEnter);
            scrollbarElement.addEventListener('mouseleave', handleMouseLeave);

            return () => {
                scrollbarElement.removeEventListener('mouseenter', handleMouseEnter);
                scrollbarElement.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [scrollConfig.hideArrowBtnsWhenInactive, scrollConfig.arrowBtnsToggleDelay]);

    useEffect(() => {
        const handleResize = () => {
            if (trackRef.current) {
                const rect = trackRef.current.getBoundingClientRect();
                let thumbLength;

                if (scrollConfig.thumbLength.mode === 'static') {
                    thumbLength = scrollConfig.thumbLength.value;
                } else {
                    thumbLength = y ? rect.height * 0.5 : rect.width * 0.5;
                }

                // Recalculate thumb position proportionally
                if (y || x) {
                    const currentPosition = thumbPosition;
                    const maxPossiblePosition = y
                        ? rect.height - thumbLength
                        : rect.width - thumbLength;

                    // Ensure the thumb stays within the new track bounds
                    const newPosition = Math.min(
                        currentPosition,
                        maxPossiblePosition
                    );

                    setThumbPosition(newPosition);
                }
            }
        };

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Also trigger on track size change (when active state changes)
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isActive, y, x, thumbPosition]);

    // Dynamic style generators

    const getTrackStyle = () => {
        const baseStyle = {
            position: 'fixed',
            transition: `width ${scrollConfig.arrowBtnsToggleDelay}ms, height ${scrollConfig.arrowBtnsToggleDelay}ms`
        };

        if (!scrollConfig.hideArrowBtnsWhenInactive || isActive) {
            // Active state - full width/height
            return {
                ...baseStyle,
                width: x
                    ? scrollConfig.enableArrowBtns
                        ? `calc(100vh - ${scrollConfig.arrowBtnsLength * 2}px)`
                        : `calc(100vh)`
                    : scrollConfig.trackThickness,
                height: y
                    ? scrollConfig.enableArrowBtns
                        ? `calc(100vh - ${scrollConfig.arrowBtnsLength * 2}px)`
                        : `calc(100vh)`
                    : scrollConfig.trackThickness
            };
        } else {
            // Inactive state - reduced width, full height
            return {
                ...baseStyle,
                width: '10px',
                height: '100vh'
            };
        }
    };

    const getThumbStyle = () => {
        if (!trackRef.current) return {};

        const trackRect = trackRef.current.getBoundingClientRect();
        let thumbLength;

        if (scrollConfig.thumbLength.mode === 'static') {
            // Use the static value directly
            thumbLength = scrollConfig.thumbLength.value;
        } else {
            // Use 50% of track size
            thumbLength = x
                ? trackRect.width * 0.5 // 50% of track width for horizontal
                : trackRect.height * 0.5; // 50% of track height for vertical
        }

        return {
            position: 'absolute',
            cursor: 'grab',
            ...(x
                ? {
                      top: '50%',
                      left: thumbPosition,
                      transform: 'translateY(-50%)',
                      height: '100%',
                      width: thumbLength
                  }
                : {
                      top: thumbPosition,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '100%',
                      height: thumbLength
                  })
        };
    };

    const getArrowBtnsStyle = () => ({
        width: x ? `var(--arrow-btns-length)` : '100%',
        height: y ? `var(--arrow-btns-length)` : '100%'
    });

    // Render methods

    const renderArrows = (direction) => {
        const directions = {
            vertical: ['up', 'down'],
            horizontal: ['left', 'right']
        };

        return directions[direction].map((dir) => (
            <div key={dir} className="arrow-btns-container">
                <div
                    className={`arrow-btn arrow-btn-${dir}`}
                    style={getArrowBtnsStyle()}
                    onMouseDown={handleMouseDown}
                />
            </div>
        ));
    };

    // Main render logic
    const renderScrollbar = () => {
        if (!x && !y) return null;

        return (
            <div
                ref={(el) => {
                    scrollbarRef.current = el;
                    trackRef.current = el;
                }}
                className={`scrollbar-track ${!isActive ? 'inactive' : ''}`}
                style={getTrackStyle()}
            >
                {y && (
                    <>
                        {scrollConfig.enableArrowBtns
                            ? renderArrows('vertical')
                            : null}
                        <div
                            className="thumb"
                            style={getThumbStyle()}
                            onMouseDown={handleMouseDown}
                        />
                    </>
                )}

                {x && (
                    <>
                        {scrollConfig.enableArrowBtns
                            ? renderArrows('horizontal')
                            : null}
                        <div
                            className="thumb"
                            style={getThumbStyle()}
                            onMouseDown={handleMouseDown}
                        />
                    </>
                )}
            </div>
        );
    };

    return renderScrollbar();
}

export default CustomScrollbar;
