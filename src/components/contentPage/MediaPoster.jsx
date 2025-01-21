import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import { useState, useEffect, useRef } from 'react';

const MediaPoster = ({ imagePath, mediaTitle }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [renderModal, setRenderModal] = useState(false);
    const posterWrapperRef = useRef(null);

    const handleMouseEnter = () => {
        setShowOverlay(true);
    };

    const handleMouseLeave = () => {
        setShowOverlay(false);
    };

    const handlePosterClick = () => {
        if (imagePath) {
            setRenderModal(true);
            setTimeout(() => {
                setIsModalOpen(true);
            }, 0);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setRenderModal(false);
        }, 300);
    };

    // Hide overlay when modal is about to open
    useEffect(() => {
        if (renderModal) {
            setShowOverlay(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [renderModal]);

    return (
        <div className="reusable-poster-container">
            {imagePath ? (
                <div
                    ref={posterWrapperRef}
                    className="reusable-poster-wrapper"
                    onClick={handlePosterClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        className="reusable-poster-image"
                        src={imagePath}
                        alt={mediaTitle}
                    />
                    <div
                        className={`reusable-hover-overlay ${showOverlay ? 'visible' : ''}`}
                    >
                        <svg className="reusable-icon">
                            <use xlinkHref={`${sprite}#fullscreen`} />
                        </svg>
                    </div>
                </div>
            ) : (
                <div className="reusable-poster-placeholder">
                    <svg className="reusable-icon">
                        <use xlinkHref={`${sprite}#image-placeholder`} />
                    </svg>
                    <p className="reusable-text">Not available</p>
                </div>
            )}

            {renderModal && ( // Conditionally render the modal container
                <div
                    className={`reusable-fullscreen-modal ${isModalOpen ? 'active' : ''}`}
                    onClick={handleCloseModal}
                >
                    <div className="reusable-modal-content">
                        {/* <button
                            className="reusable-modal-close-button"
                            onClick={handleCloseModal}
                        >
                            <svg className="reusable-icon-close">
                                <use xlinkHref={`${sprite}#close`} />
                            </svg>
                        </button> */}
                        <img
                            className="reusable-modal-image"
                            src={imagePath}
                            alt={mediaTitle}
                        />
                    </div>
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
