/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import useCarouselStore from '../../../store/carouselStore';
import useFetchStore from '../../../store/fetchStore';
import UpNextItem from './UpNextItem';
import { useQuery } from '@tanstack/react-query';

export default function UpNextSection({ movies, wrapperRef }) {
    const itemsToLoad = 5;
    const { currentSlide } = useCarouselStore();
    const { fetchGenresMap } = useFetchStore();

    const { data: genresData, error: genresError, isLoading: genresLoading } = useQuery({
        queryKey: ['genresMap'],
        queryFn: fetchGenresMap
    });

    useEffect(() => {
        if (genresError) {
            console.error('Error fetching genres:', genresError);
        }
    }, [genresError]);

    return (
        <div className="up-next-container">
            <p className="up-next-title">Up Next</p>
            <div
                className="up-next-mask"
                style={{ height: `${itemsToLoad * 120}px` }}
            >
                <div
                    className="up-next-wrapper"
                    ref={wrapperRef}
                >
                    {genresLoading ? (
                        <p>Loading genres...</p>
                    ) : (
                        Array.from({ length: itemsToLoad + 2 }, (_, i) => {
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
                                    genresData={genresData}
                                    translateY={translateY}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

UpNextSection.propTypes = {
    movies: PropTypes.arrayOf(PropTypes.object).isRequired,
    wrapperRef: PropTypes.object.isRequired
};