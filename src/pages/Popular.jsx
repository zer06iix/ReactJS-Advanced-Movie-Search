import { useEffect } from 'react';
import PopularCarousel from '../components/carousels/PopularCarousel';
import useCarouselStore from '../store/carouselStore';
import useFetchStore from '../store/fetchStore';
import { useQuery } from "@tanstack/react-query";

export default function Popular() {
    const { fetchPopularMovies } = useFetchStore();
    const { setPopularMovies, popularMovies } = useCarouselStore();

    const page = 1;
    const { data, error, isLoading } = useQuery({
        queryKey: ['popularMovies', page],
        queryFn: () => fetchPopularMovies(page),
    });

    useEffect(() => {
        if (data && data !== popularMovies) { // Check if data is different from current store
            setPopularMovies(data); // Update the store only when data is available and different
        }
    }, [data, popularMovies, setPopularMovies]); // Dependency array includes data and setPopularMovies    

    if (isLoading) {
        return (
            <div className='loader-container'>
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-light"></div>
            </div>
        );
    }
    if (error) return <div className='text-red-500'>Error: {error.message}</div>;

    return <PopularCarousel movies={popularMovies} />;
}
