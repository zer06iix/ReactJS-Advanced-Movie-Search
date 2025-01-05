/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import SearchButton from '../buttons/SearchButton';
import SearchInput from './SearchInput';
import Loading from './Loading';
import sprite from '../../styles/sprite.svg';
import useFetchStore from '../../stores/fetchStore';
import useNavStore from '../../stores/navStore';

export default function SearchBar() {
    const { fetchMovieQueries, fetchShowsQueries, fetchShowsDetails } = useFetchStore();
    const { query, setQuery } = useNavStore();

    const searchBarRef = useRef(null);
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

    const {
        data: movieData,
        isLoading: movieLoading,
        error: movieError
    } = useQuery({
        queryKey: ['movieQueries', query],
        queryFn: () => fetchMovieQueries(query),
        enabled: !!query
    });

    const {
        data: showsData,
        isLoading: showsLoading,
        error: showsError
    } = useQuery({
        queryKey: ['showsQueries', query],
        queryFn: () => fetchShowsQueries(query),
        enabled: !!query
    });

    const queryLoading = movieLoading || showsLoading;
    const queryError = movieError || showsError;
    const queryData = [
        ...(movieData ? movieData.slice(0, 5) : []),
        ...(showsData ? showsData.slice(0, 5) : [])
    ];

    // Sort queryData based on rating
    const sortedQueryData = queryData.sort((a, b) => {
        const aRating = a.vote_average || 0; // Assuming vote_average is the rating field
        const bRating = b.vote_average || 0;
        return bRating - aRating; // Sort in descending order
    });

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        setIsSearchBarOpen(true);
    };

    const queryResultState = query
        ? queryLoading
            ? 'loading'
            : sortedQueryData.length > 0
                ? 'active'
                : 'failed'
        : 'inactive';

    // const creditsQueries = sortedQueryData.map((item) => ({
    //     queryKey: ['credits', item.id],
    //     queryFn: () => fetchMovieCredits(item.id),
    //     enabled: !!item.id
    // }));

    // const creditsData = useQueries({
    //     queries: creditsQueries
    // });

    // Fetch show details for each media item
    const showsDetailsQueries = sortedQueryData
        .filter(media => media.name)
        .map(media => ({
            queryKey: ['showsDetails', media.id],
            queryFn: () => fetchShowsDetails(media.id),
            enabled: Boolean(media.id)
        }));

    const showsDetailsData = useQueries({ queries: showsDetailsQueries });


    const handleClickOutside = useCallback(
        (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsSearchBarOpen(false);
                setQuery('');
            }
        },
        [setQuery]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="searchbar-container" ref={searchBarRef}>
            <SearchInput
                className="searchbar-input"
                value={query}
                onChange={handleInputChange}
            />

            <SearchButton className="searchbar-btn" disabled={!query} />

            <div className={`query-results ${queryResultState}`}>
                {sortedQueryData.length > 0
                    ? sortedQueryData.map((media, index) => {
                        const title = media.title || media.name;
                        const imageUrl = media?.poster_path
                            ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                            : null;
                            
                        const mediaType = media.name ? 'shows' : 'movie';

                        const shows = showsDetailsData[index]?.data;
                        const inProduction = showsDetailsData[index]?.data?.in_production;

                        // {mediaType === 'shows' ? console.log(showsDetailsData[index]?.data) : console.log('not found')}

                        const isTitleOverflowing = title.length > 16;
                        let isMovie = media.title !== undefined ? true : false;
                        const infoText = isMovie ? (
                            media.release_date.slice(0, 4)
                        ) : (
                            inProduction ? (
                                <>
                                    <span className="date" title={`${shows?.first_air_date} (in production)`}>
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
                            )
                        );
                        
                        return (
                            <Link
                                to={`/${mediaType}/${media.id}`}
                                className="query-results-items"
                                key={media.id}
                            >
                                <div className="poster-container">
                                    {imageUrl ? (
                                        <div className="poster-container">
                                            <img src={imageUrl} alt={title} />
                                        </div>
                                    ) : (
                                        <div className="poster-container">
                                            <svg className="placeholder-icon">
                                                <use
                                                    xlinkHref={`${sprite}#image-placeholder`}
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="right-section">
                                    <p
                                        className="title"
                                        title={isTitleOverflowing ? title : ''}
                                    >
                                        {title}
                                    </p>
                                    <p
                                        className="info"
                                        //   title={isInfoOverflowing ? infoText : ''}
                                    >
                                        {infoText}
                                    </p>
                                </div>
                            </Link>
                        );
                    })
                    : null}

                {queryLoading ? (
                    <Loading />
                ) : (
                    <p
                        className="query-results-error-message"
                        title={queryError ? `: ${queryError.message}` : ''}
                    >
                        No results for &quot;{query}&quot;
                    </p>
                )}
            </div>
        </div>
    );
}
