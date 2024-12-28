/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import useFetchStore from "../store/fetchStore";
import useNavStore from "../store/navStore";
import { useQuery } from "@tanstack/react-query";

export default function ResultsPage() {
    const { fetchQueries } = useFetchStore();
    const { query } = useNavStore();
    const [results, setResults] = useState(null); // State to hold search results

    const {
        data: queryData,
        isLoading: queryLoading,
        error: queryError
    } = useQuery({
        queryKey: ['queries', query],
        queryFn: () => fetchQueries(query),
        enabled: !!query && !results // Only run the query if the query string is not empty and results are not set
    });

    // Handle search submission
    useEffect(() => {
        if (queryData) {
            setResults(queryData); // Store results in state
        }
    }, [queryData]);

    return (
        <div className="search-page-container">
            {queryLoading ? (
                <p className="loading-message">Loading...</p>
            ) : queryError ? (
                <p className="error-message">Error: {queryError.message}</p>
            ) : (
                <div className="results-container">
                    {results && results.length > 0 ? (
                        results.map((item) => (
                            <div className="result-item" key={item.id}>
                                <h3>{item.title}</h3>
                                {/* Add more details as needed */}
                            </div>
                        ))
                    ) : (
                        <p className="no-results-message">No results found for &quot;{query}&quot;</p>
                    )}
                </div>
            )}
        </div>
    );
}