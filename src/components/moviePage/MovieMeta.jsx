import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import useMovieStore from '../../stores/movieStore';
import { countryNames } from '../../api/countries';


const MovieMetadata = ({
    releaseDate,
    adult,
    ratingTitle,
    formattedRating,
    formattedRuntime
}) => {

    const { movie } = useMovieStore();

    return (
        <p className="metadata">
            <span title={new Date(releaseDate).toLocaleDateString('en-GB')}>
                {releaseDate.slice(0, 4)}
                <sup>
                    <svg className="icon inline" width="15" height="15">
                        <use xlinkHref={`${sprite}#help`} />
                    </svg>
                </sup>
            </span>

            {formattedRuntime !== null && (
                <>
                    <span className="separator">•</span>
                    {formattedRuntime}
                </>
            )}

            <>
                <span className="separator">•</span>
                {Array.isArray(movie.origin_country) ? 
                    movie.origin_country.map((country, index) => (
                        <span key={country} title={countryNames[country]}>
                            {country}{index < movie.origin_country.length - 1 ? ', ' : ''}
                        </span>
                    )) 
                    : <span title={countryNames[movie.origin_country]}>{movie.origin_country}</span>
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

MovieMetadata.propTypes = {
    releaseDate: PropTypes.string.isRequired,
    runtime: PropTypes.number,
    adult: PropTypes.bool,
    ratingTitle: PropTypes.string,
    formattedRating: PropTypes.string,
    formattedRuntime: PropTypes.string
};

export default MovieMetadata;
