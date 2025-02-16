/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import Loading from '../components/app/Loading';
import MediaCarousel from '../components/homePage/imageCarousel/MediaCarousel';
import UpNextSection from '../components/homePage/upNext/UpNextSection';
import NavigationMenu from '../components/HomePage/NavigationMenu';

import useFetchStore from '../stores/fetchStore';
import useMovieStore from '../stores/movieStore';
import useShowStore from '../stores/showStore';
import useNavigationMenuStore from '../stores/navigationMenuStore';


export default function Home() {
    let navigations;

    const { fetchPopularMovies, fetchTrendingMovies, fetchPopularShows, fetchTrendingShows } = useFetchStore();

    const { 
        popularMovies, setPopularMovies, 
        trendingMovies, setTrendingMovies
    } = useMovieStore();

    const { 
        popularShows, setPopularShows, 
        trendingShows, setTrendingShows
    } = useShowStore();

    const { selectedIndex, setSelectedIndex } = useNavigationMenuStore();

    const carouselWrapperRef = useRef(null); // Ref for carousel wrapper
    const upNextWrapperRef = useRef(null); // Ref for up-next section

    const { data: popularMoviesData, error: popularMoviesError, isLoading: isPopularMoviesLoading } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () => fetchPopularMovies()
    });

    const { data: trendingMoviesData, error: trendingMoviesError, isLoading: isTrendingMoviesLoading } = useQuery({
        queryKey: ['trendingMovies'],
        queryFn: () => fetchTrendingMovies()
    });

    const { data: popularShowsData, error: popularShowsError, isLoading: isPopularShowsLoading } = useQuery({
        queryKey: ['popularShows'],
        queryFn: () => fetchPopularShows()
    });

    const { data: trendingShowsData, error: trendingShowsError, isLoading: isTrendingShowsLoading } = useQuery({
        queryKey: ['trendingShows'],
        queryFn: () => fetchTrendingShows()
    });

    useEffect(() => {
        if (popularMoviesData && popularMoviesData !== popularMovies) {
            setPopularMovies(popularMoviesData); // Update the store only when data changes
        }
        if (trendingMoviesData && trendingMoviesData !== trendingMovies) {
            setTrendingMovies(trendingMoviesData); // Update the store only when data changes
        }
        if (popularShowsData && popularShowsData !== popularShows) {
            setPopularShows(popularShowsData); // Update the store only when data changes
        }
        if (trendingShowsData && trendingShowsData !== trendingShows) {
            setTrendingShows(trendingShowsData); // Update the store only when data changes
        }
    }, [popularMoviesData, trendingMoviesData, popularShowsData, trendingShowsData, popularMovies, trendingMovies, popularShows, trendingShows, setPopularMovies, setTrendingMovies, setPopularShows, setTrendingShows]);

    if (isPopularMoviesLoading || isTrendingMoviesLoading || isPopularShowsLoading || isTrendingShowsLoading) {
        return <Loading />;
    }

    if (popularMoviesError || trendingMoviesError || popularShowsError || trendingShowsError) {
        const error = popularMoviesError || trendingMoviesError || popularShowsError || trendingShowsError;
        return (
            <div className="error-container">
                <div className="error-details-wrapper">
                    <p className="title">{`An Error occurred :(`}</p>
                    <p className="description">Error: {error.message}</p>
                </div>
            </div>
        );
    }

    switch (selectedIndex){
        case 0:
            navigations = trendingMovies;
            break;
        case 1:
            navigations = trendingShows;
            break;
        case 2:
            navigations = popularMovies;
            break;
        case 3:
            navigations = popularShows;
            break;
        // case 4:
        //     navigations = newReleases;
        //     break;
        // case 5:
        //     navigations = upComing;
        //     break;
        default:
            navigations = [];
            break;
    }

    return (
        <>
            <NavigationMenu />
            <MediaCarousel
                media={navigations}
                wrapperRef={carouselWrapperRef}
                upNextWrapperRef={upNextWrapperRef}
            />
            <UpNextSection media={navigations} wrapperRef={upNextWrapperRef} />
        </>
    );
}
