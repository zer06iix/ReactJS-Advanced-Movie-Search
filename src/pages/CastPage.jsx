/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useFetchStore from '../stores/fetchStore';
import useCastStore from '../stores/castStore';
import sprite from '../styles/sprite.svg';
import useContentStore from '../stores/contentStore';
import MediaExpandable from '../components/contentPage/MediaExpandable';
import ExpanderButton from '../components/buttons/ExpanderButton';

export default function CastMemberDetailsPage() {
    const { id: castId } = useParams();
    const { fetchCastDetails, fetchCastCredits } = useFetchStore();
    const { cast, castCredits } = useCastStore();

    const {
        lastViewportWidth,
        setLastViewportWidth,
        showExpanderBtn,
        setShowExpanderBtn,
        showOverview,
        setShowOverview,
        isExpanded,
        setIsExpanded,
        lastVisibleWidth,
        setLastVisibleWidth
    } = useContentStore();
    const biographySection = useRef(null);
    const expanderBtnRef = useRef(null);
    const infoRef = useRef(null);
    const shadowOverlayRef = useRef(null);

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

            if (infoRef.current) {
                const height = infoRef.current.clientHeight;
                if (height === 96) {
                    document.documentElement.style.setProperty(
                        '--biography-height-offset',
                        '96px'
                    );
                } else if (height === 120) {
                    document.documentElement.style.setProperty(
                        '--biography-height-offset',
                        '120px'
                    );
                }

                if (height > 122) {
                    setShowExpanderBtn(false);
                    setShowOverview(false);
                    if (!lastVisibleWidth) {
                        setLastVisibleWidth(currentViewportWidth);
                    }
                    if (biographySection.current) {
                        biographySection.current.style.display = 'none';
                    }
                } else if (height <= 72) {
                    setShowExpanderBtn(false);
                    setShowOverview(true);
                    if (biographySection.current) {
                        biographySection.current.style.display = 'block';
                        if (shadowOverlayRef.current) {
                            shadowOverlayRef.current.style.opacity = '0';
                        }
                        if (expanderBtnRef.current) {
                            expanderBtnRef.current.style.opacity = '0';
                        }
                    }
                } else {
                    setShowExpanderBtn(true);
                    setShowOverview(true);
                    if (biographySection.current) {
                        biographySection.current.style.display = 'block';
                        if (shadowOverlayRef.current) {
                            shadowOverlayRef.current.style.opacity = isExpanded
                                ? '0'
                                : '1';
                        }
                        if (expanderBtnRef.current) {
                            expanderBtnRef.current.style.opacity = '1';
                        }
                    }
                }
            }

            if (lastVisibleWidth && currentViewportWidth <= lastVisibleWidth) {
                setShowOverview(false);
                if (biographySection.current) {
                    biographySection.current.style.display = 'none';
                }
            } else if (lastVisibleWidth && currentViewportWidth > lastVisibleWidth) {
                setShowOverview(true);
                setShowExpanderBtn(true);
                if (biographySection.current) {
                    biographySection.current.style.display = 'block';
                }
                setLastVisibleWidth(null);
            }

            if (!infoRef.current || infoRef.current.clientHeight <= 122) {
                setLastViewportWidth(currentViewportWidth);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [
        castDetailsData?.biography,
        isExpanded,
        lastVisibleWidth,
        setLastViewportWidth,
        setLastVisibleWidth,
        setShowExpanderBtn,
        setShowOverview
    ]);

    console.log(castDetailsData?.biography);

    return (
        <div className="cast-member-details-page">
            <div className="cast-member-details-page__content-wrapper">
                <div className="cast-member-details-page__header">
                    <div className="cast-member-details-page__poster-container">
                        {castDetailsLoading ? (
                            <div>Loading poster...</div>
                        ) : castDetailsError ? (
                            <div>Error loading poster.</div>
                        ) : castDetailsData?.profile_path ? (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${castDetailsData.profile_path}`}
                                alt={castDetailsData?.name}
                            />
                        ) : (
                            <div className="cast-member-details-page__image-placeholder">
                                <svg className="cast-member-details-page__placeholder-icon">
                                    <use xlinkHref={`${sprite}#image-placeholder`} />
                                </svg>
                                <p className="cast-member-details-page__placeholder-text">
                                    No image available
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="cast-member-details-page__info">
                        <div className="cast-member-details-page__title">
                            {castDetailsData?.name}
                        </div>
                        <p className="cast-member-details-page__metadata">
                            {castDetailsData?.birthday && (
                                <span
                                    title={new Date(
                                        castDetailsData.birthday
                                    ).toLocaleDateString('en-GB')}
                                >
                                    {age} years old
                                    <sup>
                                        <svg className="cast-member-details-page__metadata-icon">
                                            <use xlinkHref={`${sprite}#help`} />
                                        </svg>
                                    </sup>
                                </span>
                            )}

                            {castDetailsData?.place_of_birth && (
                                <>
                                    <span className="cast-member-details-page__metadata-separator">
                                        •
                                    </span>
                                    <span title="Place of Birth">
                                        {castDetailsData.place_of_birth}
                                        <sup>
                                            <svg className="cast-member-details-page__metadata-icon ">
                                                <use xlinkHref={`${sprite}#help`} />
                                            </svg>
                                        </sup>
                                    </span>
                                </>
                            )}

                            {castDetailsData?.known_for_department && (
                                <>
                                    <span className="cast-member-details-page__metadata-separator">
                                        •
                                    </span>
                                    <span title="Known For">
                                        {castDetailsData.known_for_department}
                                        <sup>
                                            <svg className="cast-member-details-page__metadata-icon">
                                                <use xlinkHref={`${sprite}#help`} />
                                            </svg>
                                        </sup>
                                    </span>
                                </>
                            )}
                        </p>

                        {/* Biography section */}
                        <div className="cast-member-details-page__biography">
                            <p className="cast-member-details-page__biography-title">
                                Biography
                            </p>
                            {castDetailsLoading ? (
                                <div>Loading biography...</div>
                            ) : castDetailsError ? (
                                <div>Error loading biography.</div>
                            ) : (
                                <div className="cast-member-details-page__biography-content">
                                    <p>{castDetailsData.biography}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
