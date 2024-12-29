import sprite from '../../../styles/sprite.svg';
import useSeriesStore from '../../../store/seriesStore';

export default function SeriesVoteCount() {

    const { series } = useSeriesStore();

    return (
        <div className="item vote-count">
            <p className="label">Vote Count</p>
            <div className="value">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#vote-count`} />
                </svg>
                <p className="average">{series.vote_count}</p>
            </div>
        </div>
    );
}