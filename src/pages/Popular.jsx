import { useEffect, useRef } from 'react';
import PopularCarousel from '../components/popularPageContent/imageCarousel/PopularCarousel';
import UpNextSection from '../components/popularPageContent/upNext/UpNextSection';
import useFetchStore from '../store/fetchStore';
import useMovieStore from '../store/movieStore';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/App/Loading';

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
        return <div className="error-container">Error: {error.message}</div>;
    }

    return (
        <>
            {/* Pass the ref down to PopularCarousel */}
            <PopularCarousel
                movies={popularMovies}
                wrapperRef={carouselWrapperRef}
                upNextWrapperRef={upNextWrapperRef}
            />
            {/* Pass the ref down to UpNextSection */}
            <UpNextSection movies={popularMovies} wrapperRef={upNextWrapperRef} />
        </>
    );
}
