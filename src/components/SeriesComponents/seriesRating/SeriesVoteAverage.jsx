import useSeriesStore from "../../../store/seriesStore"

export default function SeriesVoteAverage() {
    const { series } = useSeriesStore();

    return <p className="average">{series.vote_average.toFixed(1)}</p>;
}