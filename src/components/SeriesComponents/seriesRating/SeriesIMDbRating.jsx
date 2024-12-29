import sprite from '../../../styles/sprite.svg';
import SeriesVoteAverage from "./SeriesVoteAverage"

export default function SeriesIMDbRating() {
    return (
        <div className="item imdb-rating">
            <p className="label">IMDb Rating</p>
            <div className="value">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#rating-icon`} />
                </svg>
                <SeriesVoteAverage />
            </div>
        </div>
    );
}