/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useFetchStore from '../stores/fetchStore';
import useCastStore from '../stores/castStore';
import sprite from '../styles/sprite.svg';

export default function CastPage() {
    const { id: castId } = useParams();
    const { fetchCastDetails, fetchCastCredits } = useFetchStore();
    const { cast, castCredits } = useCastStore();

    const [isExpanded, setIsExpanded] = useState(false);
    const [showExpanderBtn, setShowExpanderBtn] = useState(true);
    const [showBiography, setShowBiography] = useState(true);
    const [lastVisibleWidth, setLastVisibleWidth] = useState(null);
    const biographyRef = useRef(null);

    const {
        data: castDetailsData,
        isLoading: castDetailsLoading,
        error: castDetailsError
    } = useQuery({
        queryKey: ['castDetails', castId],
        queryFn: () => fetchCastDetails(castId),
        enabled: !!castId
    });

    const {
        data: castCreditsData,
        isLoading: castCreditsLoading,
        error: castCreditsError
    } = useQuery({
        queryKey: ['castCredits', castId],
        queryFn: () => fetchCastCredits(castId),
        enabled: !!castId
    });

    const calculateAge = (birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const age = castDetailsData?.birthday ? calculateAge(castDetailsData.birthday) : null;

    useEffect(() => {
        const handleResize = () => {
            const currentViewportWidth = window.innerWidth;

            if (biographyRef.current) {
                const height = biographyRef.current.clientHeight;
                if (height === 96) {
                    // For 4 lines of overview text
                    document.documentElement.style.setProperty(
                        '--biography-height-offset',
                        '96px'
                    );
                } else if (height === 120) {
                    // For 5 lines of overview text
                    document.documentElement.style.setProperty(
                        '--biography-height-offset',
                        '120px'
                    );
                }

                if (height > 122) {
                    setShowExpanderBtn(false);
                    setShowBiography(false);
                    if (!lastVisibleWidth) {
                        setLastVisibleWidth(currentViewportWidth);
                    }
                    biographyRef.current.style.display = 'none';
                } else if (height <= 72) {
                    setShowExpanderBtn(false);
                    setShowBiography(true);
                    biographyRef.current.style.display = 'block';
                    const shadowOverlay =
                        biographyRef.current.querySelector('.shadow-overlay');
                    const expanderBtn = biographyRef.current.querySelector('.expander');
                    if (shadowOverlay) shadowOverlay.style.opacity = 0;
                    if (expanderBtn) expanderBtn.style.opacity = 0;
                } else {
                    setShowExpanderBtn(true);
                    setShowBiography(true);
                    biographyRef.current.style.display = 'block';
                    const shadowOverlay =
                        biographyRef.current.querySelector('.shadow-overlay');
                    if (shadowOverlay) {
                        shadowOverlay.style.opacity = isExpanded ? 0 : 1;
                    }

                    const expanderBtn = biographyRef.current.querySelector('.expander');
                    if (expanderBtn) expanderBtn.style.opacity = 1;
                }
            }

            if (lastVisibleWidth && currentViewportWidth <= lastVisibleWidth) {
                setShowBiography(false);
                if (biographyRef.current) {
                    biographyRef.current.style.display = 'none';
                }
            } else if (lastVisibleWidth && currentViewportWidth > lastVisibleWidth) {
                setShowBiography(true);
                setShowExpanderBtn(true);
                if (biographyRef.current) {
                    biographyRef.current.style.display = 'block';
                }
                setLastVisibleWidth(null);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [castDetailsData?.biography, isExpanded, lastVisibleWidth]);

    return (
        <div className="cast-page-container">
            <div className="cast-page-wrapper">
                <div className="cast-page-heading">
                    <div className="cast-page-poster-container">
                        {castDetailsData?.profile_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${castDetailsData.profile_path}`}
                                alt={castDetailsData?.name}
                            />
                        ) : (
                            <div className="cast-image-placeholder">
                                <svg className="placeholder-icon">
                                    <use xlinkHref={`${sprite}#image-placeholder`} />
                                </svg>
                                <p className="placeholder-text">No image available</p>
                            </div>
                        )}
                    </div>
                    <div className="right-side">
                        <div className="cast-page-title">{castDetailsData?.name}</div>
                        <p className="cast-metadata">
                            {castDetailsData?.birthday && (
                                <span
                                    title={new Date(
                                        castDetailsData.birthday
                                    ).toLocaleDateString('en-GB')}
                                >
                                    {age} years old
                                    <sup>
                                        <svg className="icon inline">
                                            <use xlinkHref={`${sprite}#help`} />
                                        </svg>
                                    </sup>
                                </span>
                            )}

                            {castDetailsData?.place_of_birth && (
                                <>
                                    <span className="separator">•</span>
                                    <span title="Place of Birth">
                                        {castDetailsData.place_of_birth}
                                        <sup>
                                            <svg className="icon inline">
                                                <use xlinkHref={`${sprite}#help`} />
                                            </svg>
                                        </sup>
                                    </span>
                                </>
                            )}

                            {castDetailsData?.known_for_department && (
                                <>
                                    <span className="separator">•</span>
                                    <span title="Known For">
                                        {castDetailsData.known_for_department}
                                        <sup>
                                            <svg className="icon inline">
                                                <use xlinkHref={`${sprite}#help`} />
                                            </svg>
                                        </sup>
                                    </span>
                                </>
                            )}
                        </p>

                        {/* Biography section */}
                        {castDetailsData?.biography && showBiography && (
                            <div
                                className={`biography ${isExpanded ? 'expanded' : 'collapsed'}`}
                                ref={biographyRef}
                            >
                                <div className="heading">
                                    <p className="title">Biography</p>
                                    {showExpanderBtn && (
                                        <button
                                            className={`expander ${isExpanded ? 'expanded' : 'collapsed'}`}
                                            onClick={() => setIsExpanded(!isExpanded)}
                                        >
                                            <p>More</p>
                                            <p>Less</p>
                                        </button>
                                    )}
                                </div>
                                <p className="info">{castDetailsData.biography}</p>
                                <div className="shadow-overlay"></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
