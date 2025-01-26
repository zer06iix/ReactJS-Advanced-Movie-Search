/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DynamicButton from '../../components/buttons/DynamicButton';
import MediaScroller from '../../components/castPage/media/MediaScroller';
import sprite from '../../styles/sprite.svg';

const FilmographySection = React.memo(({ castDetailsData, castCreditsData, numberOfMedia }) => {
    
    const gender = castDetailsData.gender

    if (!castCreditsData?.cast) return null;

    return (
        <div className="filmography__section">
            <div className="filmography__header">
                <p className="filmography__title">
                    {gender == 2 ? 'His ' : 'Her '} Appearances
                    <DynamicButton className="filmography__count">
                        {numberOfMedia}
                    </DynamicButton>
                    <svg className="filmography__heading-icon">
                        <use xlinkHref={`${sprite}#arrow-forward`} />
                    </svg>
                </p>
            </div>
            <MediaScroller />
        </div>
    );
});
FilmographySection.displayName = 'FilmographySection';

FilmographySection.propTypes = {
    castCreditsData: PropTypes.shape({
        // Should be an array of media objects
        cast: PropTypes.arrayOf(PropTypes.object)
    }),
    numberOfMedia: PropTypes.number.isRequired
};

export default FilmographySection;
