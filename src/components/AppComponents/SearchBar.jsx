import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import SearchButton from '../buttons/SearchButton';
import SearchInput from './SearchInput';
import useFetchStore from '../../store/fetchStore';

export default function SearchBar() {
    
    const { fetchQueries } = useFetchStore();
    const [query, setQuery] = useState('');

    const { data: queryData, error: queryError } = useQuery({
        queryKey: ['queries', query],
        queryFn: () => fetchQueries(query),
        enabled: !!query // Only run the query if the query string is not empty
    });

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const queryResultState = queryData && queryData.length > 0 ? 'active' : 'inactive';

    return (
        <div className="searchbar-container">
            <SearchInput
                className="searchbar-input"
                value={query}
                onChange={handleInputChange}
            />

            <SearchButton className="searchbar-btn" />

            <div className="query-results active">
                {queryData && queryData.length > 0 ? (
                    queryData.map((result) => (
                        <div className="result-item" key={result.id}>
                            <p className="result-title">{result.title}</p>
                            <p className="result-info">{result.year} | {result.genre}</p>
                        </div>
                    ))
                ) : (
                    <p className="query-results-error-message">
                        No results for &quot;{query}&quot;{queryError && `: ${queryError.message}`}
                    </p>
                )}
            </div>
        </div>
    );
}
