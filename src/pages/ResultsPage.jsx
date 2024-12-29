/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import useFetchStore from '../store/fetchStore';
import useNavStore from '../store/navStore';
import { useQuery } from '@tanstack/react-query';

export default function ResultsPage() {
    const { fetchQueries } = useFetchStore();
    const { query } = useNavStore();
    const [results, setResults] = useState(null);

    const {
        data: queryData,
        isLoading: queryLoading,
        error: queryError
    } = useQuery({
        queryKey: ['queries', query],
        queryFn: () => fetchQueries(query),
        enabled: !!query && !results
    });

    // Handle search submission
    useEffect(() => {
        if (queryData) {
            setResults(queryData);
        }
    }, [queryData]);

    let isMovie = true;

    return (
        <div className="search-page-container">
            {queryLoading ? (
                <p className="loading-message">Loading...</p>
            ) : queryError ? (
                <p className="error-message">Error: {queryError.message}</p>
            ) : (
                <div className="results-container">
                    {results && results.length > 0 ? (
                        results.map((movie) => {
                            const title = movie.title;
                            const imageUrl = movie?.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : null;

                            return (
                                <div
                                    className="result-item-container"
                                    key={movie.id}
                                >
                                    <div className="poster">
                                        {imageUrl && (
                                            <img src={imageUrl} alt={title} />
                                        )}
                                    </div>
                                    <div className="right-side">
                                        <div className="heading">
                                            <p className="title">{movie.title}</p>
                                            <div className="rating">
                                                {movie.vote_average.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="card-detail">
                                            <p>
                                                {isMovie ? (
                                                    <>
                                                        Movies
                                                        <span className="separator">
                                                            •
                                                        </span>
                                                    </>
                                                ) : null}
                                                {!isMovie ? <>TV-Shows</> : null}

                                                {movie.release_date.slice(0, 4)}
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
