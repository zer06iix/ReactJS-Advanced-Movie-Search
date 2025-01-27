/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { debounce } from 'lodash';
import SearchButton from '../../buttons/SearchButton';
import SearchInput from './SearchInput';
import Loading from '../Loading';
import sprite from '../../../styles/sprite.svg';
import useFetchStore from '../../../stores/fetchStore';
import useNavStore from '../../../stores/navStore';

const MAX_RESULTS_DISPLAYED = 5;

export default function SearchBar() {
    // --- State & Store Hooks ---
    const { fetchMovieQueries, fetchShowsQueries, fetchShowsDetails } = useFetchStore();
    const { query, setQuery } = useNavStore();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // --- Refs & Local State ---
    const searchBarRef = useRef(null);
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    //
    const [filterType, setFilterType] = useState('all'); // all, movies, shows

    // --- Debounced Search Handler ---
    const debouncedSearch = useCallback(
        debounce((searchTerm) => {
            setQuery(searchTerm);
        }, 0),
        [setQuery]
    );

    const handleInputChange = (event) => {
        const searchTerm = event.target.value;
        debouncedSearch(searchTerm);
        setIsSearchBarOpen(true);
        setSelectedIndex(-1);
    };

    // --- Combined Search Query ---
    const {
        data: combinedData,
        isLoading: queryLoading,
        error: queryError
    } = useQuery({
        queryKey: ['searchResults', query],
        queryFn: async () => {
            if (!query || query.length < 3) {
                return { movies: [], shows: [] }; // Early exit for short queries
            }
            const [movies, shows] = await Promise.all([
                fetchMovieQueries(query),
                fetchShowsQueries(query)
            ]);
            return {
                movies: movies.slice(0, MAX_RESULTS_DISPLAYED),
                shows: shows.slice(0, MAX_RESULTS_DISPLAYED)
            };
        },
        enabled: !!query //  Only run if query is truthy
    });

    // --- Filtered & Sorted Query Data ---
    const queryData = useMemo(() => {
        if (!combinedData) return [];
        const allResults = [
            ...(combinedData.movies || []),
            ...(combinedData.shows || [])
        ];
        return allResults
            .filter((item) => {
                if (filterType === 'all') return true;
                return (
                    (filterType === 'movies' && item.title) ||
                    (filterType === 'shows' && item.name)
                );
            })
            .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0)); // Sort by rating
    }, [combinedData, filterType]);

    // --- Fetch Show Details ---
    const showsDetailsQueries = useMemo(
        () =>
            queryData
                .filter((media) => media.name)
                .map((media) => ({
                    queryKey: ['showsDetails', media.id],
                    queryFn: () => fetchShowsDetails(media.id),
                    enabled: Boolean(media.id)
                })),
        [queryData, fetchShowsDetails]
    );

    const showsDetailsData = useQueries({ queries: showsDetailsQueries });

    // --- Keyboard Navigation Handler ---
    const handleKeyDown = useCallback(
        (event) => {
            if (!isSearchBarOpen || queryData.length === 0) return; // Ensure Search is open and has results
            switch (event.key) {
                case 'ArrowDown':
                    setSelectedIndex((prev) => Math.min(prev + 1, queryData.length - 1));
                    break;
                case 'ArrowUp':
                    setSelectedIndex((prev) => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                    if (selectedIndex !== -1) {
                        const selectedItem = queryData[selectedIndex];
                        navigate(
                            `/${selectedItem.name ? 'shows' : 'movie'}/${selectedItem.id}`
                        );
                        setIsSearchBarOpen(false); // Close on selection
                        setQuery(''); // Clear search term after navigation
                    }
                    break;
                case 'Escape':
                    setIsSearchBarOpen(false);
                    break;
                default:
                    break;
            }
        },
        [queryData, selectedIndex, navigate, isSearchBarOpen, setQuery]
    );

    // --- Click Outside Handler ---
    const handleClickOutside = useCallback(
        (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsSearchBarOpen(false);
                setQuery('');
            }
        },
        [setQuery]
    );

    // --- Event Listeners ---
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleClickOutside, handleKeyDown]);

    // --- Prefetch related searches ---
    useEffect(() => {
        if (query && query.length > 2) {
            // Ensure query has a length of at least 3
            queryClient.prefetchQuery({
                queryKey: ['searchResults', query],
                queryFn: async () => {
                    const [movies, shows] = await Promise.all([
                        fetchMovieQueries(query),
                        fetchShowsQueries(query)
                    ]);
                    return {
                        movies: movies.slice(0, MAX_RESULTS_DISPLAYED),
                        shows: shows.slice(0, MAX_RESULTS_DISPLAYED)
                    };
                }
            });
        }
    }, [query, queryClient, fetchMovieQueries, fetchShowsQueries]);

    // --- Determine Query Result State ---
    const queryResultState = useMemo(() => {
        if (!query) return 'inactive';
        if (queryLoading) return 'loading';
        return queryData.length > 0 ? 'active' : 'failed';
    }, [query, queryLoading, queryData.length]);

    // --- Render Function ---
    return (
        <div className="searchbar-container" ref={searchBarRef}>
            <SearchInput
                className="searchbar-input"
                value={query}
                onChange={handleInputChange}
                aria-label="Search movies and TV shows"
                placeholder="Search movies, TV shows..."
                role="searchbox"
            />

            <SearchButton className="searchbar-btn" disabled={!query} />

            <div
                className={`query-results ${queryResultState} ${isSearchBarOpen ? 'open' : ''}`}
            >
                {queryResultState === 'active' &&
                    queryData.map((media, index) => {
                        const title = media.title || media.name;
                        const imageUrl = media?.poster_path
                            ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                            : null;

                        const mediaType = media.name ? 'shows' : 'movie';
                        const shows = showsDetailsData[index]?.data;
                        const inProduction = shows?.in_production;

                        const isTitleOverflowing = title.length > 16;
                        const isMovie = media.title !== undefined;

                        const infoText = isMovie ? (
                            media.release_date.slice(0, 4)
                        ) : inProduction ? (
                            <>
                                <span
                                    className="date"
                                    title={`${shows?.first_air_date} (in production)`}
                                >
                                    Since {shows?.first_air_date?.slice(0, 4) || 'N/A'}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="date" title={shows?.first_air_date}>
                                    {shows?.first_air_date?.slice(0, 4) || 'N/A'}
                                </span>
                                <span className="date-separator">–</span>
                                <span className="date" title={shows?.last_air_date}>
                                    {shows?.last_air_date?.slice(0, 4) || 'N/A'}
                                </span>
                            </>
                        );
                        return (
                            <Link
                                to={`/${mediaType}/${media.id}`}
                                className={`query-results-items ${index === selectedIndex ? 'selected' : ''}`}
                                key={media.id}
                                onClick={() => setIsSearchBarOpen(false)}
                            >
                                <div className="poster-container">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={title} />
                                    ) : (
                                        <svg className="placeholder-icon">
                                            <use
                                                xlinkHref={`${sprite}#image-placeholder`}
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="right-section">
                                    <p
                                        className="title"
                                        title={isTitleOverflowing ? title : ''}
                                    >
                                        {title}
                                    </p>
                                    <p className="info">{infoText}</p>
                                </div>
                            </Link>
                        );
                    })}

                {queryResultState === 'loading' && <Loading />}

                {queryResultState === 'failed' && (
                    <p
                        className="query-results-error-message"
                        title={queryError ? `: ${queryError.message}` : ''}
                    >
                        {`No results for "{query}"`}
                    </p>
                )}
            </div>
        </div>
    );
}
