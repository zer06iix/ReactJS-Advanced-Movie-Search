import useMovieStore from '../../stores/movieStore';

export default function MovieGenresItem() {
    const { movie } = useMovieStore();
    const genreNames = movie.genres ? movie.genres.map((genre) => genre.name) : [];

    return (
        <div className="genre-container">
            {genreNames.map((name, index) => (
                <>
                    <span key={index} className="genre-item">
                        {name}
                    </span>
                    {index < genreNames.length - 1 && ', '}
                </>
            ))}
        </div>
    );
}
