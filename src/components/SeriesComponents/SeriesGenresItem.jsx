import useSeriesStore from "../../store/seriesStore";

export default function SeriesGenresItem() {
    const { series } = useSeriesStore();
    const genreNames = series.genres ? series.genres.map((genre) => genre.name) : [];

    return (
        <div className="genre-container">
            {genreNames.map((name, index) => (
                <span key={index} className="genre-item">
                    {name}{','}
                </span>
            ))}
        </div>
    )
}