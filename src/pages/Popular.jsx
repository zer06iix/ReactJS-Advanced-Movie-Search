import { useEffect } from 'react';
import PopularCarousel from '../components/carousels/PopularCarousel';
import useFetchStore from '../store/fetchStore';
import useMovieStore from '../store/movieStore';
import { useQuery } from '@tanstack/react-query';
import Loading from '../components/App/Loading';

export default function Popular() {
    const { fetchPopularMovies } = useFetchStore();
    const { setPopularMovies, popularMovies } = useMovieStore();
    
    const page = 1;
    const { data, error, isLoading } = useQuery({
        queryKey: ['popularMovies', page],
        queryFn: () => fetchPopularMovies(page)
    });

    useEffect(() => {
        if (data && data !== popularMovies) {
            // Check if data is different from current store
            setPopularMovies(data); // Update the store only when data is available and different
        }
    }, [data, popularMovies, setPopularMovies]); // Dependency array includes data and setPopularMovies

    if (isLoading) {
        return (
            <Loading />
        );
    }
    if (error) return <div className="error-container">Error: {error.message}</div>;

    return <PopularCarousel movies={popularMovies} />;
}
