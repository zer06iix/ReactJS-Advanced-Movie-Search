import sprite from '../../../styles/sprite.svg';
import MovieVoteAverage from "./MovieVoteAverage"

export default function MovieIMDbRating() {
    return (
        <div className="item imdb-rating">
            <p className="label">IMDb Rating</p>
            <div className="value">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#rating-icon`} />
                </svg>
                <MovieVoteAverage />
            </div>
        </div>
    );
}