import sprite from '../../../styles/sprite.svg';
import useMovieStore from '../../../store/movieStore';

export default function MovieVoteCount() {

    const { movie } = useMovieStore();

    return (
        <div className="item vote-count">
            <p className="label">Vote Count</p>
            <div className="value">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#vote-count`} />
                </svg>
                <p className="average">{movie.vote_count}</p>
            </div>
        </div>
    );
}