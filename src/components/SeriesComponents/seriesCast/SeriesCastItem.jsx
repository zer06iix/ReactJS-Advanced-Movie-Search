/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import SeriesCastImage from './SeriesCastImage';

export default function SeriesCastItem({ member }) {
    const nameRef = useRef(null);
    const characterRef = useRef(null);
    const [nameTitle, setNameTitle] = useState('');
    const [characterTitle, setCharacterTitle] = useState('');
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
    };

    useEffect(() => {
        if (nameRef.current) {
            const overflow =
                nameRef.current.scrollWidth > nameRef.current.clientWidth;
            if (overflow) {
                setNameTitle(member.name);
            }
        }

        if (characterRef.current) {
            const overflow =
                characterRef.current.scrollWidth > characterRef.current.clientWidth;
            if (overflow) {
                setCharacterTitle(member.character || 'Unknown Character');
            }
        }
    }, [member]);

    return (
        <div className="cast-member">
            <div className="cast-image-container">
                {!imgError ? (
                    <SeriesCastImage member={member} onError={handleImageError} />
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