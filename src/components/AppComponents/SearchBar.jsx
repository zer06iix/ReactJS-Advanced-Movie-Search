import { useState } from 'react';
import SearchButton from '../buttons/SearchButton';
import SearchInput from './SearchInput';

export default function SearchBar() {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const queryResultState = query ? 'active' : 'inactive';

    return (
        <div className="searchbar-container">
            <SearchInput
                className="searchbar-input"
                value={query}
                onChange={handleInputChange}
            />

            <SearchButton className="searchbar-btn" />

            <div className={`query-results ${queryResultState}`}>
                <p className="query-results-error-message">
                    No results for &quot;{query}&quot;
                </p>
            </div>
        </div>
    );
}
