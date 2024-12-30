/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Loading from '../components/app/Loading';
import useShowStore from '../stores/showStore';
import useFetchStore from '../stores/fetchStore';
// import ShowsGenres from '../components/showsPage/ShowsGenres';
// import ShowsOverview from '../components/showsPage/ShowsOverview';
// import ShowsCastScroller from '../components/showsPage/showsCast/ShowsCastScroller';
// import ShowsIMDbRating from '../components/showsPage/showsRating/ShowsIMDbRating';
// import ShowsPopularity from '../components/showsPage/showsRating/ShowsPopularity';

export default function ShowsPage() {
    const { id } = useParams();
    const { fetchSeriesDetails, fetchSeriesCredits } = useFetchStore();
    const { show, setShow, credits, setCredits } = useShowStore();
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        data: showsData,
        isLoading: showsLoading,
        error: showsError
    } = useQuery({
        queryKey: ['showsDetails', id],
        queryFn: () => fetchSeriesDetails(id),
        enabled: !!id,
        onSuccess: (data) => setShow(data)
    });

    const {
        data: showsCreditsData,
        isLoading: creditsLoading,
        error: creditsError
    } = useQuery({
        queryKey: ['seriesCredits', id],
        queryFn: () => fetchSeriesCredits(id),
        enabled: !!id,
        onSuccess: (data) => setCredits(data)
    });

    useEffect(() => {
        if (showsData) {
            setShow(showsData);
        }
        if (showsCreditsData) {
            setCredits(showsCreditsData);
        }
    }, [showsData, showsCreditsData, setShow, setCredits]);

    if (showsLoading || creditsLoading) return <Loading />;
    if (showsError) return <p>Error loading shows details: {showsError.message}</p>;
    if (creditsError) return <p>Error loading shows credits: {creditsError.message}</p>;

    const toggleDescriptionExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="show-page-container">
            <div className="show-detail-container">
                <h1 className="show-title">{show ? show.name : 'Loading...'}</h1>
            </div>
        </div>
    );
}
