import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import useShowStore from '../../stores/showStore';
import { countryNames } from '../../api/countries';


const ShowsMeta = ({
    showFormattedDate,
    seasonsCount,
    adult,
    ratingTitle,
    formattedRating
}) => {

    const { shows } = useShowStore();

    return (
        <p className="metadata">
            {showFormattedDate}

            <span className="separator">•</span>

            {`${seasonsCount} Seasons`}

            <>
                <span className="separator">•</span>
                {Array.isArray(shows.origin_country) ? 
                    shows.origin_country.map((country, index) => (
                        <span key={country} title={countryNames[country]}>
                            {country}{index < shows.origin_country.length - 1 ? ', ' : ''}
                        </span>
                    )) 
                    : <span title={countryNames[shows.origin_country]}>{shows.origin_country}</span>
                }
                <sup>
                    <svg className="icon inline" width="15" height="15">
                        <use xlinkHref={`${sprite}#help`} />
                    </svg>
                </sup>
            </>

            {adult !== undefined && (
                <>
                    <span className="separator">•</span>
                    <span title={ratingTitle}>
                        {formattedRating}
                        <sup>
                            <svg className="icon inline" width="15" height="15">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
                    </span>
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
