import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import Loading from '../components/app/Loading';
import MediaCarousel from '../components/homePage/imageCarousel/MediaCarousel';
import UpNextSection from '../components/homePage/upNext/UpNextSection';
import NavigationMenu from '../components/HomePage/NavigationMenu';

import useFetchStore from '../stores/fetchStore';
import useMovieStore from '../stores/movieStore';

export default function Home() {
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
                    <p className="title">{`An Error occurred :(`}</p>
                    <p className="description">Error: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <NavigationMenu />
            <MediaCarousel
                media={popularMovies}
                wrapperRef={carouselWrapperRef}
                upNextWrapperRef={upNextWrapperRef}
            />
            <UpNextSection movies={popularMovies} wrapperRef={upNextWrapperRef} />
        </>
    );
}
