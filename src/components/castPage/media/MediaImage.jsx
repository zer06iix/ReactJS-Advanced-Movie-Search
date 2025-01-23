/* eslint-disable react/prop-types */
import { useState } from 'react';
import sprite from '../../../styles/sprite.svg';

export default function MediaImage({ media }) {
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
    };

    return (
        <>
            {!imgError ? (
                <img
                    src={
                        media.poster_path
                            ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                            : 'placeholder_image_url'
                    }
                    title={media.name}
                    alt={media.name}
                    className="media-item-image"
                    onError={handleImageError}
                />
            ) : (
                <div>
                    {/* <div className="cast-image-placeholder">
                    <svg className="placeholder-icon">
                        <use xlinkHref={`${sprite}#image-placeholder`} />
                    </svg>
                    <p className="placeholder-text">Not available</p> */}
                </div>
            )}
        </>
    );
}
