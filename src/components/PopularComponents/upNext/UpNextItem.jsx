/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Slide from '../Slide';
import Genre from '../../MovieComponents/Genre';
import { useQuery } from '@tanstack/react-query';
import useFetchStore from '../../../store/fetchStore';
import { Link } from 'react-router-dom';
import Loading from '../../AppComponents/Loading';

const UpNextItem = ({
    movie,
    translateY
}) => {
    const { fetchCredits } = useFetchStore();

    const { 
        data: creditsData, 
        isLoading: creditsLoading, 
        error: creditsError 
    } = useQuery({
        queryKey: ['credits', movie?.id],
        queryFn: () => fetchCredits(movie?.id)
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

    // const titleWithYear = `${movie.title} (${new Date(movie.release_date).getFullYear()})`;
    const director = creditsData?.crew?.find(
        (member) => member.job === 'Director'
    );

    const directorName = director ? director.name : 'Director not found';

    // const slideGenres = movie.genre_ids.slice(0, 3).map((id) => (
    //     <div className="genre-item" key={id}>
    //         {genresData[id] || 'Unknown Genre'}
    //     </div>
    // ));

    const titleParts = movie.title.length > 30 
        ? [movie.title.slice(0, 30), movie.title.slice(30)] 
        : [movie.title];
        
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
                    <div className={movie.title.length < 30 ? 'title-wrap' : ''}>
                        <Link to={`/movie/${movie.id}`} className="title">
                                {titleParts[0]}{titleParts[1] && <br />}{titleParts[1]}
                        </Link>
                    </div>
                    <p className="director-name">Directed by {directorName}</p>
                </div>

                <div className="genres-container"> {/* Genres gonna be links later */}
                    {movie.genre_ids && movie.genre_ids.length > 0 ? (
                        <Genre genreIds={movie.genre_ids} />
                    ) : (
                        <div>Genre not available</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpNextItem;
