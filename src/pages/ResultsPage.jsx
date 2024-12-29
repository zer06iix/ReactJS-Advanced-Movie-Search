/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import useFetchStore from '../store/fetchStore';
import useNavStore from '../store/navStore';
import { useQueries } from '@tanstack/react-query';

export default function ResultsPage() {
    const { fetchMovieQueries, fetchSeriesQueries } = useFetchStore();
    const { query } = useNavStore();
    const [results, setResults] = useState(null); // State to hold search results

    const queries = [
        {
            queryKey: ['movieQueries', query],
            queryFn: () => fetchMovieQueries(query),
            enabled: !!query
        },
        {
            queryKey: ['seriesQueries', query],
            queryFn: () => fetchSeriesQueries(query),
            enabled: !!query
        }
    ];

    const queryResults = useQueries({ queries }); 

    const queryLoading = queryResults.some(result => result.isLoading);
    const queryError = queryResults.find(result => result.error)?.error;

    // Handle search submission
    useEffect(() => {
        const movieData = queryResults[0].data || [];
        const seriesData = queryResults[1].data || [];
        
        if (movieData.length > 0 || seriesData.length > 0) {
            setResults([...movieData, ...seriesData]);
        }
    }, [queryResults]);

    // Sort results based on rating
    const sortedResults = results ? results.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)) : [];

    return (
        <div className="search-page-container">
            {queryLoading ? (
                <p className="loading-message">Loading...</p>
            ) : queryError ? (
                <p className="error-message">Error: {queryError.message}</p>
            ) : (
                <div className="results-container">
                    {sortedResults.length > 0 ? (
                        sortedResults.map((item) => {
                            const mediaType = item.name ? 'series' : 'movie';
                            const title = mediaType === 'movie' ? item.title : item.name;
                            const imageUrl = item?.poster_path
                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                : null;

                            return (
                                <div
                                    className="result-item-container"
                                    key={item.id}
                                >
                                    <div className="poster">
                                        {imageUrl && (
                                            <img src={imageUrl} alt={title} />
                                        )}
                                    </div>
                                    <div className="right-side">
                                        <div className="heading">
                                            <p className="title">{title}</p>
                                            <div className="rating">
                                                {item.vote_average.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="card-detail">
                                            <p>
                                                {mediaType === 'movie' ? (
                                                    <>
                                                        Movies
                                                        <span className="separator">
                                                            {' '}•{' '}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        Series
                                                        <span className="separator">
                                                            {' '}•{' '}
                                                        </span>
                                                    </>
                                                )}
                                                {item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="no-results-message">
                            No results found for &quot;{query}&quot;
                        </p>
                    )}
                </div>
            )}
        </div>
    ); // <-- Added missing closing parenthesis here
}
