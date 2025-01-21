/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useFetchStore from '../stores/fetchStore';
import useCastStore from '../stores/castStore';
import sprite from '../styles/sprite.svg';
import useContentStore from '../stores/contentStore';
import MediaPoster from '../components/contentPage/MediaPoster';
import DynamicButton from '../components/buttons/DynamicButton';
import Loading from '../components/app/Loading';
import MediaScroller from '../components/castPage/media/MediaScroller';

const BIO_HEIGHT_THRESHOLD = 122;
const BIO_SHORT_HEIGHT_THRESHOLD = 72;
const INFO_MAX_LINES_THRESHOLD = 2; // Adjust as needed based on your styling

export default function CastMemberDetailsPage() {
    const { id: castId } = useParams();
    const { fetchCastDetails, fetchCastCredits } = useFetchStore();
    const { cast, setCast, castCredits, setCastCredits } = useCastStore();

    // Simplified state management for biography section
    const {
        lastViewportWidth,
        setLastViewportWidth,
        showExpanderBtn,
        setShowExpanderBtn,
        isExpanded,
        setIsExpanded,
        lastVisibleWidth,
        setLastVisibleWidth,
        showExpandable,
        setShowExpandable
    } = useContentStore();

    const biographySectionRef = useRef(null);
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

    const numberOfMedia =
        castCreditsData && castCreditsData.cast ? castCreditsData.cast.length : 0;

    useEffect(() => {
        if (castDetailsData) {
            setCast(castDetailsData);
        }
        if (castCreditsData) {
            setCastCredits(castCreditsData);
        }
    }, [castCreditsData, castDetailsData, setCast, setCastCredits]);

    // if (!cast || castDetailsLoading || castCreditsLoading) return <Loading />

    const calculateAge = useCallback((birthDate) => {
        if (!birthDate) return null;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }, []);

    const age = React.useMemo(
        () => (castDetailsData?.birthday ? calculateAge(castDetailsData.birthday) : null),
        [castDetailsData?.birthday, calculateAge]
    );

    const handleResize = useCallback(() => {
        if (!infoRef.current) return;

        const currentViewportWidth = window.innerWidth;
        const infoHeight = infoRef.current.clientHeight;

        // Set CSS variable based on initial info height
        let bioOffset;
        if (infoHeight <= 96) {
            bioOffset = '96px';
        } else if (infoHeight <= 120) {
            bioOffset = '120px';
        } else {
            bioOffset = `${infoHeight}px`; // Fallback or more dynamic approach
        }
        document.documentElement.style.setProperty(
            '--biography-height-offset',
            bioOffset
        );

        // Handle biography expander and visibility
        if (infoHeight > BIO_HEIGHT_THRESHOLD) {
            setShowExpanderBtn(false);
            setShowExpandable(false);
            if (!lastVisibleWidth) {
                setLastVisibleWidth(currentViewportWidth);
            }
            if (biographySectionRef.current) {
                biographySectionRef.current.style.display = 'none';
            }
        } else if (infoHeight <= BIO_SHORT_HEIGHT_THRESHOLD) {
            setShowExpanderBtn(false);
            setShowExpandable(true);
            if (biographySectionRef.current) {
                biographySectionRef.current.style.display = 'block';
                if (shadowOverlayRef.current) {
                    shadowOverlayRef.current.style.opacity = '0';
                }
                if (expanderBtnRef.current) {
                    expanderBtnRef.current.style.opacity = '0';
                }
            }
        } else {
            setShowExpanderBtn(true);
            setShowExpandable(true);
            if (biographySectionRef.current) {
                biographySectionRef.current.style.display = 'block';
                if (shadowOverlayRef.current) {
                    shadowOverlayRef.current.style.opacity = isExpanded ? '0' : '1';
                }
                if (expanderBtnRef.current) {
                    expanderBtnRef.current.style.opacity = '1';
                }
            }
        }

        // Handle viewport width changes and biography visibility
        if (lastVisibleWidth && currentViewportWidth <= lastVisibleWidth) {
            setShowExpandable(false);
            if (biographySectionRef.current) {
                biographySectionRef.current.style.display = 'none';
            }
        } else if (lastVisibleWidth && currentViewportWidth > lastVisibleWidth) {
            setShowExpandable(true);
            setShowExpanderBtn(true);
            if (biographySectionRef.current) {
                biographySectionRef.current.style.display = 'block';
            }
            setLastVisibleWidth(null);
        }

        // Update last viewport width if info is within threshold
        if (infoHeight <= BIO_HEIGHT_THRESHOLD) {
            setLastViewportWidth(currentViewportWidth);
        }
    }, [
        isExpanded,
        lastVisibleWidth,
        setLastViewportWidth,
        setLastVisibleWidth,
        setShowExpanderBtn,
        setShowExpandable
    ]);

    useEffect(() => {
        handleResize(); // Initial call on mount
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    return (
        <div className="cast-member-details-page">
            <div className="cast-member-details-page__content-wrapper">
                <div className="cast-member-details-page__header">
                    <div className="cast-member-details-page__poster-container">
                        {castDetailsLoading ? (
                            <div>Loading poster...</div>
                        ) : castDetailsError ? (
                            <div>Error loading poster.</div>
                        ) : (
                            <MediaPoster
                                imagePath={`https://image.tmdb.org/t/p/w500${castDetailsData?.profile_path}`}
                                mediaTitle={castDetailsData?.name}
                            />
                        )}
                    </div>
                    <div className="cast-member-details-page__info" ref={infoRef}>
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

                        <div
                            className="cast-member-details-page__biography"
                            // ref={biographySectionRef}
                        >
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
                
                {/* Meida section */}
                {castCreditsData && castCreditsData.cast && (
                    <div className="content-template__cast-section">
                        <div className="content-template__cast-header">
                            <p className="content-template__cast-title">
                                His/Her appearances
                                <DynamicButton className="content-template__cast-count">
                                    {numberOfMedia}
                                </DynamicButton>
                                <svg className="content-template__cast-icon">
                                    <use xlinkHref={`${sprite}#arrow-forward`} />
                                </svg>
                            </p>
                            <DynamicButton className="content-template__view-full-credits-button">
                                Movies & TV shows
                            </DynamicButton>
                        </div>

                        <MediaScroller />
                    </div>
                )}
            </div>
        </div>
    );
}
