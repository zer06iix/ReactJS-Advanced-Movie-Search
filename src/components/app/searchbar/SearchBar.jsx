/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import SearchButton from '../../buttons/SearchButton';
import SearchInput from './SearchInput';
import Loading from '../Loading';
import sprite from '../../../styles/sprite.svg';
import useFetchStore from '../../../stores/fetchStore';
import useNavStore from '../../../stores/navStore';

export default function SearchBar() {
    const { fetchSearchQueries, fetchMovieQueries, fetchShowsQueries, fetchShowsDetails } = useFetchStore();
    const { query, setQuery } = useNavStore();

    const searchBarRef = useRef(null);
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['searchQuery', query],
        queryFn: () => fetchSearchQueries(query),
        enabled: !!query
    });
    
    // const {
    //     data: movieData,
    //     isLoading: movieLoading,
    //     error: movieError
    // } = useQuery({
    //     queryKey: ['movieQueries', query],
    //     queryFn: () => fetchMovieQueries(query),
    //     enabled: !!query
    // });

    // const {
    //     data: showsData,
    //     isLoading: showsLoading,
    //     error: showsError
    // } = useQuery({
    //     queryKey: ['showsQueries', query],
    //     queryFn: () => fetchShowsQueries(query),
    //     enabled: !!query
    // });

    const queryLoading = isLoading;
    const queryError = error;
    const queryData = data ? data.slice(0, 10) : [];

    // Sort queryData based on rating
    const sortedQueryData = queryData.sort((a, b) => {
        const aRating = a?.vote_average || 0; // Assuming vote_average is the rating field
        const bRating = b?.vote_average || 0;
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
                        
                        let mediaType;
                        switch(media.media_type) {
                            case 'person':
                                mediaType = 'cast';
                                break
                            case 'tv':
                                mediaType = 'shows';
                                break
                            case 'movie':
                                mediaType = 'movie';
                                break
                            default: 
                                mediaType = '';
                        }
                        

                        const imageUrl = media?.poster_path
                            ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                            : `https://image.tmdb.org/t/p/w500${media.profile_path}`;
                            

                        const shows = showsDetailsData[index]?.data;
                        const inProduction = showsDetailsData[index]?.data?.in_production;
                        
                        // {mediaType === 'shows' ? console.log(showsDetailsData[index]?.data) : console.log('not found')}
                        const isTitleOverflowing = title.length > 16;
                        let isMovie = media.title !== undefined ? true : false;
                        
                        const departmentMappings = {
                            'Acting': (media) => {
                                if (media.gender === 2) {
                                    return 'Actor';
                                } else if (media.gender === 1) {
                                    return 'Actress';
                                } else {
                                    return 'Actor/Actress'; // Handle cases with no gender
                                }
                            },
                            'Directing': () => 'Director',
                            'Writing': () => 'Writer',
                            'Production': () => 'Producer',
                            'Camera': () => 'Cinematographer',
                            'Sound': () => 'Sound Designer',
                            'Editing': () => 'Editor',
                            'Art': () => 'Art Director',
                            'Costume & Make-Up': () => 'Costume & Make-Up',
                            'Visual Effects': () => 'Visual Effects',
                            'Crew': () => 'Crew',
                            'Creator': () => 'Creator',
                        };
                        
                        function mapKnownForDepartment(media) {
                            if (!media || !media.known_for_department) {
                                return 'Crew';
                            }
                        
                            const department = media.known_for_department;
                            const mappingFunction = departmentMappings[department];
                            if (mappingFunction) {
                                return mappingFunction(media);
                            }
                            return 'Crew'; // Default if not found
                        }

                        let infoText;
                        if (mediaType === 'cast') {
                            infoText = media.known_for_department ? (
                                <>
                                    <span className="department" title={`Known For: ${media.known_for_department}`}>
                                        {mapKnownForDepartment(media)}
                                    </span>
                                </>
                            ) : (
                                'N/A'
                            );
                        } else {
                            infoText = isMovie
                                ? media.release_date?.slice(0, 4) || 'N/A'
                                : (
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
                        }
                        
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