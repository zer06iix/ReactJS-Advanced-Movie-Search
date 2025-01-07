import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import { useState } from 'react';

const MediaPoster = ({ imagePath, mediaTitle }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isHovered, setIsHovered] = useState(false); // State to track hover

    const handleFullscreenClick = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div 
            className="poster-container"
            onMouseEnter={() => setIsHovered(true)} // Set hover state on mouse enter
            onMouseLeave={() => setIsHovered(false)} // Reset hover state on mouse leave
        >
            {imagePath != null ? (
                <>
                    <div 
                        className={`poster-wrapper`}
                        onClick={handleFullscreenClick} // Make the whole poster clickable
                    >
                        <img className="poster-image" src={imagePath} alt={mediaTitle} />
                        <div className={`hover-overlay ${isHovered ? 'visible' : ''}`}>
                            <svg className="icon" height={50} width={50} fill="white">
                                <use
                                    xlinkHref={`${sprite}#${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}`}
                                />
                            </svg>
                        </div>
                    </div>
                    {isFullscreen && (
                        <div className="fullscreen-overlay" onClick={handleFullscreenClick}>
                            <div className="fullscreen-content">
                                <img className="fullscreen-image" src={imagePath} alt={mediaTitle} />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="poster-placeholder">
                    <svg className="icon">
                        <use xlinkHref={`${sprite}#image-placeholder`} />
                    </svg>
                    <p className="text">Not available</p>
                </div>
            )}
        </div>
    );
};

MediaPoster.propTypes = {
    imagePath: PropTypes.string,
    mediaTitle: PropTypes.string.isRequired
};

export default MediaPoster;
