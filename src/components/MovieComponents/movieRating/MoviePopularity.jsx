import sprite from '../../../styles/sprite.svg';
import useMovieStore from '../../../store/movieStore';

export default function MoviePopularity() {

    const { movie } = useMovieStore();

    return (
        <div className="item popularity">
            <p className="label">Popularity</p>
            <div className="value">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#popularity`} />
                </svg>
                <p className="average">
                    {movie.popularity >= 1000
                        ? `${(movie.popularity / 1000).toFixed(1)}k`
                        : movie.popularity.toFixed(0)}
                </p>
            </div>
        </div>
    );
}