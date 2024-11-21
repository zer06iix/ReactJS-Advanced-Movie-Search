/* eslint-disable react/prop-types */
export default function Overview({ movie }) {
    return (
        <>
            <p className="movie-overview">{movie.overview}</p>
        </>
    )
}