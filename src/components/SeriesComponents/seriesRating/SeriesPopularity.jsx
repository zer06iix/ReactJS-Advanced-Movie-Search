import sprite from '../../../styles/sprite.svg';
import useSeriesStore from '../../../store/seriesStore';

export default function SeriesPopularity() {

    const { series } = useSeriesStore();

    return (
        <div className="item popularity">
            <p className="label">Popularity</p>
            <div className="value">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#popularity`} />
                </svg>
                <p className="average">
                    {series.popularity >= 1000
                        ? `${(series.popularity / 1000).toFixed(1)}k`
                        : series.popularity.toFixed(0)}
                </p>
            </div>
        </div>
    );
}