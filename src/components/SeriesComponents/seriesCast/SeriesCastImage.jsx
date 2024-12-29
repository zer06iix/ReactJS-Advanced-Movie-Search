/* eslint-disable react/prop-types */
import { useState } from 'react';
import sprite from '../../../styles/sprite.svg';

export default function SeriesCastImage({ member }) {
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
    };

    return (
        <>
            {!imgError ? (
                <img
                    src={
                        member.profile_path
                            ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                            : 'placeholder_image_url'
                    }
                    title={member.name}
                    alt={member.name}
                    className="cast-image"
                    onError={handleImageError}
                />
            ) : (
                <div className="cast-image-placeholder">
                    <svg className="placeholder-icon">
                        <use xlinkHref={`${sprite}#image-placeholder`} />
                    </svg>
                    <p className="placeholder-text">Not available</p>
                </div>
            )}
        </>
    );
}