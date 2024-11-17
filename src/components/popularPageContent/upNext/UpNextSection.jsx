/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API_KEY } from '../../../api/tmdb';
import useCarouselStore from '../../../store/carouselStore';
import useFetchStore from '../../../store/fetchStore';
import UpNextItem from './UpNextItem';

const GENRE_API_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

export default function UpNextSection({ movies, wrapperRef }) {
    const itemsToLoad = 3;
    const { currentSlide } = useCarouselStore();
    const { fetchCredits } = useFetchStore();
    const [genreMap, setGenreMap] = useState({});
    const [creditsData, setCreditsData] = useState({});
    const [creditsLoading, setCreditsLoading] = useState({});
    const [creditsError, setCreditsError] = useState({});

    // Fetch genres on component mount
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(GENRE_API_URL);
                const data = await response.json();
                const genres = data.genres.reduce((acc, { id, name }) => {
                    acc[id] = name;
                    return acc;
                }, {});
                setGenreMap(genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    // Fetch credits on component mount
    useEffect(() => {
        const fetchAllCredits = async () => {
            const promises = movies.map(async (movie) => {
                setCreditsLoading((prev) => ({
                    ...prev,
                    [movie.id]: true
                }));
                try {
                    const data = await fetchCredits(movie.id);
                    setCreditsData((prev) => ({
                        ...prev,
                        [movie.id]: data
                    }));
                } catch (error) {
                    setCreditsError((prev) => ({
                        ...prev,
                        [movie.id]: error
                    }));
                } finally {
                    setCreditsLoading((prev) => ({
                        ...prev,
                        [movie.id]: false
                    }));
                }
            });
            await Promise.all(promises);
        };

        if (movies.length > 0) {
            fetchAllCredits();
        }
    }, [movies, fetchCredits]);

    // Adjust the transform positioning of items dynamically
    useEffect(() => {
        const upNextItems = document.querySelectorAll('.up-next-item');
        upNextItems.forEach((item, index) => {
            const translateY = ((itemsToLoad + 1) / 2 - index) * -100 - 50;
            item.style.transform = `translateY(${translateY}%)`;
        });
    }, [movies]);

    return (
        <div className="up-next-container">
            <p className="up-next-title">Up Next</p>

            <div
                className="up-next-mask"
                style={{ height: `${itemsToLoad * 120}px` }}
            >
                <div className="up-next-wrapper" ref={wrapperRef}>
                    {Array.from({ length: itemsToLoad + 2 }, (_, i) => {
                        const movieIndex = currentSlide + i;
                        const adjustedIndex =
                            (movieIndex + movies.length) % movies.length;
                        const movie = movies[adjustedIndex];
                        if (!movie) return null;

                        const translateY = ((itemsToLoad + 1) / 2 - i) * -100 - 50;

                        return (
                            <UpNextItem
                                key={i}
                                movie={movie}
                                index={i}
                                genreMap={genreMap}
                                creditsData={creditsData}
                                creditsLoading={creditsLoading}
                                creditsError={creditsError}
                                translateY={translateY}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

UpNextSection.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    wrapperRef: PropTypes.object.isRequired
};
