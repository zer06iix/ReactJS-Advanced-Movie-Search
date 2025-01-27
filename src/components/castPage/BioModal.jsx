import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import DynamicButton from '../../components/buttons/DynamicButton';
import sprite from '../../styles/sprite.svg';
import CustomDropdown from './CustomDropdown';

const BioModal = React.memo(
    ({
        isBioModalOpen,
        bioModalRef,
        handleCloseBioModal,
        bioSource,
        setBioSource,
        castDetailsLoading,
        castDetailsError,
        castDetailsData,
        wikipediaBioLoading,
        wikipediaBioError,
        wikipediaBio
    }) => {
        const [containerHeight, setContainerHeight] = useState(0);
        const tmdbRef = useRef(null);
        const wikipediaRef = useRef(null);
        const containerRef = useRef(null);

        const updateContainerHeight = useCallback(() => {
            if (!containerRef.current) return;

            let activeRef = null;
            if (bioSource === 'tmdb') {
                activeRef = tmdbRef.current;
            } else if (bioSource === 'wikipedia') {
                activeRef = wikipediaRef.current;
            }

            if (activeRef) {
                setContainerHeight(activeRef.offsetHeight);
            }
        }, [bioSource, tmdbRef, wikipediaRef]);

        useEffect(() => {
            updateContainerHeight();
        }, [updateContainerHeight]);

        useEffect(() => {
            // Set initial height on component mount
            updateContainerHeight();
            window.addEventListener('resize', updateContainerHeight);

            return () => {
                window.removeEventListener('resize', updateContainerHeight);
            };
        }, [updateContainerHeight]);

        return (
            <div
                className={`cast-member-details-page__bio-modal ${
                    isBioModalOpen ? 'open' : ''
                }`}
                ref={bioModalRef}
            >
                <div className="cast-member-details-page__bio-modal-content">
                    <div className="cast-member-details-page__bio-modal-header">
                        <div className="cast-member-details-page__bio-modal-header--left-container">
                            <p className="cast-member-details-page__bio-modal-title">
                                Biography
                            </p>
                            <CustomDropdown
                                bioSource={bioSource}
                                setBioSource={setBioSource}
                            />
                        </div>
                        <DynamicButton
                            className="cast-member-details-page__bio-modal-close-button"
                            onClick={handleCloseBioModal}
                        >
                            <svg className="cast-member-details-page__bio-modal-close-icon">
                                <use xlinkHref={`${sprite}#close`} />
                            </svg>
                        </DynamicButton>
                    </div>

                    <div
                        className="cast-member-details-page__biography-text-container"
                        ref={containerRef}
                        style={{ height: `${containerHeight}px` }}
                    >
                        <div className="biography-shadow-overlay biography-shadow-overlay-start"></div>

                        {castDetailsLoading ? (
                            <div>Loading biography from TMDB...</div>
                        ) : castDetailsError || !castDetailsData?.biography ? null : (
                            <p
                                className="cast-member-details-page__biography-text"
                                style={{ opacity: bioSource === 'tmdb' ? 1 : 0 }}
                                ref={tmdbRef}
                            >
                                {castDetailsData.biography}
                            </p>
                        )}

                        {wikipediaBioLoading ? (
                            <div>Loading from Wikipedia...</div>
                        ) : wikipediaBioError || !wikipediaBio ? null : (
                            <p
                                className="cast-member-details-page__biography-text"
                                style={{ opacity: bioSource === 'wikipedia' ? 1 : 0 }}
                                ref={wikipediaRef}
                            >
                                {wikipediaBio}
                            </p>
                        )}

                        <div className="biography-shadow-overlay biography-shadow-overlay-end"></div>
                    </div>
                </div>
            </div>
        );
    }
);

BioModal.propTypes = {
    isBioModalOpen: PropTypes.bool.isRequired,
    bioModalRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired,
    handleCloseBioModal: PropTypes.func.isRequired,
    bioSource: PropTypes.string.isRequired,
    setBioSource: PropTypes.func.isRequired,
    castDetailsLoading: PropTypes.bool.isRequired,
    castDetailsError: PropTypes.instanceOf(Error),
    castDetailsData: PropTypes.shape({
        biography: PropTypes.string
    }),
    wikipediaBioLoading: PropTypes.bool.isRequired,
    wikipediaBioError: PropTypes.instanceOf(Error),
    wikipediaBio: PropTypes.string
};

BioModal.displayName = 'BioModal';

export default BioModal;
