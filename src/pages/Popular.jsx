import { useEffect, useRef } from 'react';
import PopularCarousel from '../components/PopularComponents/imageCarousel/PopularCarousel';
import UpNextSection from '../components/PopularComponents/upNext/UpNextSection';
import useFetchStore from '../store/fetchStore';
import useMovieStore from '../store/movieStore';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/AppComponents/Loading';

export default function Popular() {
    const { fetchPopularMovies } = useFetchStore();
    const { setPopularMovies, popularMovies } = useMovieStore();

    const carouselWrapperRef = useRef(null); // Ref for carousel wrapper
    const upNextWrapperRef = useRef(null); // Ref for up-next section

    const page = 1;
    const { data, error, isLoading } = useQuery({
        queryKey: ['popularMovies', page],
        queryFn: () => fetchPopularMovies(page)
    });

    useEffect(() => {
        if (data && data !== popularMovies) {
            setPopularMovies(data); // Update the store only when data changes
        }
    }, [data, popularMovies, setPopularMovies]);

    if (isLoading) {
        return <Loading />;
    }
    if (error) {
        return (
            <div className="error-container">
                <div className="error-details-wrapper">
                    <p className="title">An Error occurred :(</p>
                    <p className="description">Error: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <PopularCarousel
                movies={popularMovies}
                wrapperRef={carouselWrapperRef}
                upNextWrapperRef={upNextWrapperRef}
            />
            <UpNextSection movies={popularMovies} wrapperRef={upNextWrapperRef} />
        </>
    );
}
