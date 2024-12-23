import GenresItem from "./GenresItem";

export default function Genres() {
    return (
        <>
            <pre className="genres">
                <span>Genres:</span> {' '}
                <GenresItem/>
            </pre>
        </>
    )
}