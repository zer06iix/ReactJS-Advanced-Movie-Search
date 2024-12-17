/* eslint-disable react/prop-types */
import React, { useRef, useEffect, useState } from 'react';
import CastImage from './CastImage';

export default function CastItem({ member }) {
    const nameRef = useRef(null);
    const characterRef = useRef(null);
    const [nameTitle, setNameTitle] = useState('');
    const [characterTitle, setCharacterTitle] = useState('');
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
    };

    return (
        <div className="cast-member">
            {' '}
            {/* Ensure this is a block-level element */}
            <div className="cast-image-container">
                {!imgError ? (
                    <CastImage member={member} onError={handleImageError} />
                ) : null}
            </div>
            <div className="detail">
                <p className="cast-name" ref={nameRef} title={nameTitle}>
                    {member.name}
                </p>
                <p
                    className="cast-character-name"
                    ref={characterRef}
                    title={characterTitle}
                >
                    {member.character || 'Unknown Character'}
                </p>
            </div>
        </div>
    );
}
