/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Slide from '../Slide';
import Genre from './Genre';
import { useQuery } from '@tanstack/react-query';
import useFetchStore from '../../../stores/fetchStore';
import { Link } from 'react-router-dom';
import Loading from '../../../components/app/Loading';

const UpNextItem = ({ movie, index, translateY }) => {
    const { fetchMovieCredits } = useFetchStore();

    const {
        data: creditsData,
        isLoading: creditsLoading,
        error: creditsError
    } = useQuery({
        queryKey: ['credits', movie?.id],
        queryFn: () => fetchMovieCredits(movie?.id)
    });

    if (creditsLoading) {
        return (
            <div
                className="up-next-item"
                style={{ transform: `translateY(${translateY}%)` }}
            >
                <Loading />
            </div>
        );
    }

    if (creditsError) {
        return (
            <div
                className="up-next-item"
                style={{ transform: `translateY(${translateY}%)` }}
            >
                Error loading credits: {creditsError.message}
            </div>
        );
    }

    const director = creditsData?.crew?.find((member) => member.job === 'Director');

    const directorName = director ? director.name : 'Director not found';

    return (
        <div
            className="up-next-item"
            style={{ transform: `translateY(${translateY}%)` }}
        >
            <Link to={`/movie/${movie.id}`} className="poster">
                <Slide slide={movie} posterDetail={false} />
            </Link>

            <div className="right-side">
                <div className="heading">
                    <Link to={`/movie/${movie.id}`}>
                        <p className="title">{movie.title}</p>
                    </Link>
                    <p className="director-name">Directed by {directorName}</p>
                </div>

                <div className="genres-container">
                    {' '}
                    {/* MovieGenres will be links later */}
                    <div className="genre-scroll-container">
                        {movie.genre_ids && movie.genre_ids.length > 0 ? (
                            <Genre genreIds={movie.genre_ids} />
                        ) : (
                            <div>Genre not available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpNextItem;
