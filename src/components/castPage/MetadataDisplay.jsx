import React from 'react';
import sprite from '../../styles/sprite.svg';
import PropTypes from 'prop-types';

const MetadataDisplay = React.memo(({ castDetailsData, age }) => {
    return (
        <p className="cast-member-details-page__metadata">
            {castDetailsData?.deathday ? (
                <span
                    title={new Date(castDetailsData.deathday).toLocaleDateString('en-GB')}
                >
                    Passed away at {age}
                    <sup>
                        <svg className="cast-member-details-page__metadata-icon">
                            <use xlinkHref={`${sprite}#help`} />
                        </svg>
                    </sup>
                </span>
            ) : (
                castDetailsData?.birthday && (
                    <span
                        title={new Date(castDetailsData.birthday).toLocaleDateString(
                            'en-GB'
                        )}
                    >
                        {age} years old
                        <sup>
                            <svg className="cast-member-details-page__metadata-icon">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
                    </span>
                )
            )}

            {castDetailsData?.place_of_birth && (
                <>
                    <span className="cast-member-details-page__metadata-separator">
                        •
                    </span>
                    <span title="Place of Birth">
                        {castDetailsData.place_of_birth}
                        <sup>
                            <svg className="cast-member-details-page__metadata-icon ">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
                    </span>
                </>
            )}

            {castDetailsData?.known_for_department && (
                <>
                    <span className="cast-member-details-page__metadata-separator">
                        •
                    </span>
                    <span title="Known For">
                        {castDetailsData.known_for_department}
                        <sup>
                            <svg className="cast-member-details-page__metadata-icon">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
                    </span>
                </>
            )}
        </p>
    );
});
MetadataDisplay.displayName = 'MetadataDisplay';

MetadataDisplay.propTypes = {
    castDetailsData: PropTypes.shape({
        deathday: PropTypes.string,
        birthday: PropTypes.string,
        place_of_birth: PropTypes.string,
        known_for_department: PropTypes.string
    }),
    age: PropTypes.number
};

export default MetadataDisplay;
