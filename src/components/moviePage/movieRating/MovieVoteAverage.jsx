import useMovieStore from '../../../stores/movieStore';

export default function MovieVoteAverage() {
    const { movie } = useMovieStore();

    return <p className="average">{movie.vote_average.toFixed(1)}</p>;
}
