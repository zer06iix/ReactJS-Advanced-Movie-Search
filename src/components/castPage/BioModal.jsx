import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
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
        return (
            <div
                className={`cast-member-details-page__bio-modal ${isBioModalOpen ? 'open' : ''}`}
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

                    {bioSource === 'tmdb' ? (
                        castDetailsLoading ? (
                            <div>Loading biography from TMDB...</div>
                        ) : castDetailsError || !castDetailsData?.biography ? (
                            <div>Biography not found on TMDB.</div>
                        ) : (
                            <div className="cast-member-details-page__biography-text-container">
                                <p className="cast-member-details-page__biography-text">
                                    {castDetailsData.biography}
                                </p>
                            </div>
                        )
                    ) : bioSource === 'wikipedia' ? (
                        wikipediaBioLoading ? (
                            <div>Loading from Wikipedia...</div>
                        ) : wikipediaBioError || !wikipediaBio ? (
                            <div>Nothing found on Wikipedia.</div>
                        ) : (
                            <div className="cast-member-details-page__biography-text-container">
                                <p className="cast-member-details-page__biography-text">
                                    {wikipediaBio}
                                </p>
                            </div>
                        )
                    ) : null}
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
        // Define other properties of castDetailsData if needed
    }),
    wikipediaBioLoading: PropTypes.bool.isRequired,
    wikipediaBioError: PropTypes.instanceOf(Error),
    wikipediaBio: PropTypes.string
};

BioModal.displayName = 'BioModal';

export default BioModal;
