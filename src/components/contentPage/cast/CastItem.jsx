/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

    useEffect(() => {
        // Check if name overflows
        if (nameRef.current) {
            const overflow =
                nameRef.current.scrollWidth > nameRef.current.clientWidth;
            if (overflow) {
                setNameTitle(member.name); // Set the full name if it overflows
            }
        }

        // Check if character overflows
        if (characterRef.current) {
            const overflow =
                characterRef.current.scrollWidth > characterRef.current.clientWidth;
            if (overflow) {
                setCharacterTitle(member.character || 'Unknown Character'); // Set the full character name if it overflows
            }
        }
    }, [member]);

    return (
        <Link 
            to={`/cast/${member.id}`}
            className="cast-member"
        >
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
        </Link>
    );
}
