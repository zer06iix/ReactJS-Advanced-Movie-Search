import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import { useState } from 'react';

const MediaPoster = ({ imagePath, mediaTitle }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // const handleFullscreenClick = () => {
    //     setIsFullscreen(!isFullscreen);
    // };

    return (
        <div className="poster-container">
            {imagePath != null ? (
                <>
                    <div className={`poster-wrapper ${isFullscreen ? 'fullscreen' : ''}`}>
                        <img className="poster-image" src={imagePath} alt={mediaTitle} />
                        <div className="overlay">
                            {/* <button
                                className="fullscreen-btn"
                                onClick={handleFullscreenClick}
                            >
                                <svg className="icon">
                                    <use
                                        xlinkHref={`${sprite}#${isFullscreen ? 'fullscreen-exit' : 'fullscreen'}`}
                                    />
                                </svg>
                            </button> */}
                        </div>
                    </div>
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
