import PropTypes from 'prop-types';

const ShowsMeta = ({
    showFormattedDate,
    seasonsCount,
    adult,
    ratingTitle,
    formattedRating
}) => {
    return (
        <p className="metadata">
            {showFormattedDate}

            <span className="separator">•</span>

            {`${seasonsCount} Seasons`}

            {adult !== undefined && (
                <>
                    <span className="separator">•</span>
                    <span title={ratingTitle}>{formattedRating}</span>
                </>
            )}
        </p>
    );
};

ShowsMeta.propTypes = {
    showFormattedDate: PropTypes.string.isRequired,
    seasonsCount: PropTypes.number.isRequired,
    adult: PropTypes.bool,
    ratingTitle: PropTypes.string,
    formattedRating: PropTypes.string
};

export default ShowsMeta;
