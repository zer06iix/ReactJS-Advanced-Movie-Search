import { useState, useRef, useEffect } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import SearchButton from '../buttons/SearchButton';
import SearchInput from './SearchInput';
import Loading from './Loading';
import sprite from '../../styles/sprite.svg';

import useFetchStore from '../../store/fetchStore';

export default function SearchBar() {
    const { fetchQueries, fetchCredits } = useFetchStore();
    const [query, setQuery] = useState('');
    const searchBarRef = useRef(null);

    const {
        data: queryData,
        isLoading: queryLoading,
        error: queryError
    } = useQuery({
        queryKey: ['queries', query],
        queryFn: () => fetchQueries(query),
        enabled: !!query // Only run the query if the query string is not empty
    });

    // const { data: creditsData } = useQuery({
    //     queryKey: ['credits', movie?.id],
    //     queryFn: () => fetchCredits(movie?.id)
    // });

    // const director = creditsData?.crew?.find((member) => member.job === 'Director');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
    };

    const queryResultState = query
        ? queryLoading
            ? 'loading'
            : queryData && queryData.length > 0
              ? 'active'
              : 'failed'
        : 'inactive';

    const queryResults = queryData?.slice(0, 10) || []; // Handle potential undefined

    const creditsQueries = queryResults.map((movie) => ({
        queryKey: ['credits', movie.id],
        queryFn: () => fetchCredits(movie.id),
        enabled: !!movie.id
    }));

    const creditsData = useQueries({
        queries: creditsQueries
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                (searchBarRef.current &&
                    !searchBarRef.current.contains(event.target)) ||
                event.key === 'Escape'
            ) {
                setQuery('');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleClickOutside);
        };
    }, []);

    return (
        <div className="searchbar-container" ref={searchBarRef}>
            <SearchInput
                className="searchbar-input"
                value={query}
                onChange={handleInputChange}
            />

            <SearchButton className="searchbar-btn" />

            <div className={`query-results ${queryResultState}`}>
                {queryData && queryData.length > 0
                    ? queryResults.map((movie, index) => {
                          const creditsQueryResult = creditsData[index];
                          const title = movie.title;

                          const imageUrl = movie?.poster_path
                              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                              : null;

                          //   const hasCreditsError = creditsQueryResult.isError;
                          const isLoadingCredits = creditsQueryResult.isLoading;
                          const credits = creditsQueryResult.data;

                          const director = credits?.crew?.find(
                              (member) => member.job === 'Director'
                          );
                          const directorName = director
                              ? director.name
                              : isLoadingCredits
                                ? 'Loading director...'
                                : null;

                          const isTitleOverflowing = title.length > 16;
                          const directorNameString = directorName || '';
                          const infoText = movie.release_date
                              ? movie.release_date.slice(0, 4) +
                                ' • By ' +
                                directorNameString
                              : directorNameString;
                          const infoLength = infoText.length;
                          const isInfoOverflowing = infoLength > 20;

                          return (
                              <div className="query-results-items" key={movie.id}>
                                  <div className="poster-container">
                                      {imageUrl ? (
                                          <div className="poster-container">
                                              <img
                                                  src={imageUrl}
                                                  alt={movie.title}
                                              />
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
                                          title={isInfoOverflowing ? infoText : ''}
                                      >
                                          {movie.release_date && directorName ? (
                                              <>
                                                  {movie.release_date.slice(0, 4)}
                                                  <span className="separator">
                                                      •
                                                  </span>
                                                  By {directorName}
                                              </>
                                          ) : (
                                              <>
                                                  {movie.release_date
                                                      ? movie.release_date.slice(
                                                            0,
                                                            4
                                                        )
                                                      : null}
                                                  {directorName ? (
                                                      <>By {directorName}</>
                                                  ) : null}
                                              </>
                                          )}
                                      </p>
                                  </div>
                              </div>
                          );
                      })
                    : null}

                {queryLoading ? (
                    <Loading />
                ) : (
                    <p
                        className="query-results-error-message"
                        title={queryError && `: ${queryError.message}`}
                    >
                        No results for &quot;{query}&quot;
                    </p>
                )}
            </div>
        </div>
    );
}
