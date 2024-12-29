import MovieGenresItem from "./MovieGenresItem";

export default function MovieGenres() {
    return (
        <>
            <pre className="genres">
                <span>MovieGenres:</span> {' '}
                <MovieGenresItem/>
            </pre>
        </>
    )
}