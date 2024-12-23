import sprite from '../../../styles/sprite.svg';
import VoteAverage from "./VoteAverage"

export default function IMDbRating() {
    return (
        <div className="item imdb-rating">
            <p className="label">IMDb Rating</p>
            <div className="value">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#rating-icon`} />
                </svg>
                <p className="average">
                    <VoteAverage />
                </p>
            </div>
        </div>
    );
}