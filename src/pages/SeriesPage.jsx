/* eslint-disable no-unused-vars */
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/AppComponents/Loading';
import SeriesCastScroller from '../components/SeriesComponents/seriesCast/SeriesCastScroller';
import SeriesGenres from '../components/SeriesComponents/SeriesGenres';
import SeriesOverview from '../components/SeriesComponents/SeriesOverview';
import SeriesIMDbRating from '../components/SeriesComponents/seriesRating/SeriesIMDbRating';
import SeriesPopularity from '../components/SeriesComponents/seriesRating/SeriesPopularity';
import useSeriesStore from '../store/seriesStore';
import useFetchStore from '../store/fetchStore';

export default function SeriesPage() {
    const { id } = useParams();
    const { fetchSeriesDetails, fetchSeriesCredits } = useFetchStore();
    const { series, setSeries, credits, setCredits } = useSeriesStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const { data: seriesData, isLoading: seriesLoading, error: seriesError } = useQuery({
        queryKey: ['seriesDetails', id],
        queryFn: () => fetchSeriesDetails(id),
        enabled: !!id,
        onSuccess: (data) => setSeries(data)
    });

    const { data: seriesCreditsData, isLoading: creditsLoading, error: creditsError } = useQuery({
        queryKey: ['seriesCredits', id],
        queryFn: () => fetchSeriesCredits(id),
        enabled: !!id,
        onSuccess: (data) => setCredits(data)
    });

    useEffect(() => {
        if (seriesData) {
            setSeries(seriesData);
        }
        if (seriesCreditsData) {
            setCredits(seriesCreditsData);
        }
    }, [seriesData, seriesCreditsData, setSeries, setCredits]);

    if (seriesLoading || creditsLoading) return <Loading />;
    if (seriesError) return <p>Error loading series details: {seriesError.message}</p>;
    if (creditsError) return <p>Error loading series credits: {creditsError.message}</p>;

    const toggleDescriptionExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="series-page">
            <h1 className="series-title">{series ? series.name : 'Loading...'}</h1>
            {series && (
                <>
                    <SeriesGenres />
                    <SeriesOverview isExpanded={isExpanded} toggleDescriptionExpand={toggleDescriptionExpand} />
                    <div className="ratings">
                        <SeriesIMDbRating />
                        <SeriesPopularity />
                    </div>
                    <SeriesCastScroller />
                </>
            )}
        </div>
    );
}