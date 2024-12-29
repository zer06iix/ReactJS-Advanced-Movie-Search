/* eslint-disable react/prop-types */
import useSeriesStore from "../../store/seriesStore";
import ExpanderButton from "../buttons/ExpanderButton";

export default function SeriesOverview({ isExpanded, toggleDescriptionExpand }) {
    
    const { series } = useSeriesStore();
    
    return (
        <>
            <p className="info">{series.overview}</p>
            <ExpanderButton isExpanded={isExpanded} onClick={toggleDescriptionExpand}/>
        </>
    );
}