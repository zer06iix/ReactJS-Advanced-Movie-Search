/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Loading from '../components/app/Loading';
import useFetchStore from '../stores/fetchStore';
import useShowStore from '../stores/showStore';
import ContentTemplate from './ContentTemplate';

export default function ShowsPage() {
    const { id } = useParams();
    const { fetchShowsDetails, fetchShowsCredits, fetchGenres } = useFetchStore(); // Make sure fetchGenres is available
    const { show, setShow, credits, setCredits, genresMap } = useShowStore();
    const [isLoading, setIsLoading] = useState(true);

    const {
        data: showsData,
        isLoading: showsLoading,
        error: showsError
    } = useQuery({
        queryKey: ['showsDetails', id],
        queryFn: () => fetchShowsDetails(id),
        enabled: !!id
    });

    const {
        data: showsCreditsData,
        isLoading: creditsLoading,
        error: creditsError
    } = useQuery({
        queryKey: ['showsCredits', id],
        queryFn: () => fetchShowsCredits(id),
        enabled: !!id
    });

    useEffect(() => {
        fetchGenres(); // Fetch genres
    }, [fetchGenres]);

    useEffect(() => {
        if (showsData) {
            setShow(showsData);
        }
        if (showsCreditsData) {
            setCredits(showsCreditsData);
        }
    }, [showsData, showsCreditsData, setShow, setCredits]);

    useEffect(() => {
        if (genresMap && show) {
            setIsLoading(false);
        }
    }, [genresMap, show]);

    if (!show || isLoading || showsLoading || creditsLoading) return <Loading />; // Handle loading
    if (showsError) return <p>Error loading show details: {showsError.message}</p>;
    if (creditsError) return <p>Error loading show credits: {creditsError.message}</p>;
    if (!genresMap) {
        return <Loading />;
    }

    return (
        <ContentTemplate
            type="Show"
            media={show}
            creditsData={credits}
            genresMap={genresMap}
        />
    );
}
