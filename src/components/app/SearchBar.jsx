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
    const { fetchMovieQueries, fetchSeriesQueries, fetchMovieCredits } = useFetchStore();
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
        data: seriesData,
        isLoading: seriesLoading,
        error: seriesError
    } = useQuery({
        queryKey: ['seriesQueries', query],
        queryFn: () => fetchSeriesQueries(query),
        enabled: !!query
    });

    const queryLoading = movieLoading || seriesLoading;
    const queryError = movieError || seriesError;
    const queryData = [
        ...(movieData ? movieData.slice(0, 5) : []),
        ...(seriesData ? seriesData.slice(0, 5) : [])
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

    const creditsQueries = sortedQueryData.map((item) => ({
        queryKey: ['credits', item.id],
        queryFn: () => fetchMovieCredits(item.id),
        enabled: !!item.id
    }));

    const creditsData = useQueries({
        queries: creditsQueries
    });

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
                    ? sortedQueryData.map((item, index) => {
                          const creditsQueryResult = creditsData[index];
                          const title = item.title || item.name;

                          const imageUrl = item?.poster_path
                              ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                              : null;

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
                          const infoText =
                              item.release_date || item.first_air_date
                                  ? (item.release_date || item.first_air_date).slice(
                                        0,
                                        4
                                    ) +
                                    ' • By ' +
                                    directorNameString
                                  : directorNameString;
                          const infoLength = infoText.length;
                          const isInfoOverflowing = infoLength > 20;

                          const mediaType = item.name ? 'shows' : 'movie';

                          return (
                              <Link
                                  to={`/${mediaType}/${item.id}`}
                                  className="query-results-items"
                                  key={item.id}
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
                                          title={isInfoOverflowing ? infoText : ''}
                                      >
                                          {item.release_date ||
                                          (item.first_air_date && directorName) ? (
                                              <>
                                                  {(
                                                      item.release_date ||
                                                      item.first_air_date
                                                  ).slice(0, 4)}
                                                  <span className="separator">•</span>
                                                  {mediaType === 'movie' ? (
                                                      <>In Movies</>
                                                  ) : (
                                                      <>In Shows</>
                                                  )}
                                              </>
                                          ) : (
                                              <>
                                                  {item.release_date ||
                                                  item.first_air_date
                                                      ? (
                                                            item.release_date ||
                                                            item.first_air_date
                                                        ).slice(0, 4)
                                                      : null}
                                                  {mediaType === 'movie' ? (
                                                      <>In Movies</>
                                                  ) : (
                                                      <>In Shows</>
                                                  )}
                                              </>
                                          )}
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
