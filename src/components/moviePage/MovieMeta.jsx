import PropTypes from 'prop-types';

const MovieMetadata = ({
    releaseDate,
    adult,
    ratingTitle,
    formattedRating,
    formattedRuntime
}) => {
    return (
        <p className="metadata">
            <span title={new Date(releaseDate).toLocaleDateString('en-GB')}>
                {releaseDate.slice(0, 4)}
            </span>

            {formattedRuntime !== null && (
                <>
                    <span className="separator">•</span>
                    {formattedRuntime}
                </>
            )}

            {adult !== undefined && (
                <>
                    <span className="separator">•</span>
                    <span title={ratingTitle}>{formattedRating}</span>
                </>
            )}
        </p>
    );
};

MovieMetadata.propTypes = {
    releaseDate: PropTypes.string.isRequired,
    runtime: PropTypes.number,
    adult: PropTypes.bool,
    ratingTitle: PropTypes.string,
    formattedRating: PropTypes.string,
    formattedRuntime: PropTypes.string
};

export default MovieMetadata;
