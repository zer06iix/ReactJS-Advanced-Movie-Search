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
const INFO_MAX_LINES_THRESHOLD = 2;

export default function CastMemberDetailsPage() {
    const { id: castId } = useParams();
    const { fetchCastDetails, fetchCastCredits } = useFetchStore();
    const { cast, setCast, castCredits, setCastCredits } = useCastStore();

    const [isBioModalOpen, setIsBioModalOpen] = useState(false);
    const [renderModal, setRenderModal] = useState(false);
    const [bioSource, setBioSource] = useState('tmdb'); // 'tmdb' or 'wikipedia'

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
    const bioModalRef = useRef(null);

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

    const handleCloseBioModal = () => {
        setIsBioModalOpen(false);
        setTimeout(() => {
            setRenderModal(false);
        }, 300);
    };

    const handleOpenBioModal = () => {
        setRenderModal(true);
        setTimeout(() => {
            setIsBioModalOpen(true);
        }, 0);
    };

    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape' && isBioModalOpen) {
                handleCloseBioModal();
            }
        };

        if (isBioModalOpen) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isBioModalOpen, handleCloseBioModal]);

    const calculateAge = useCallback((birthDate, deathDate) => {
        if (!birthDate) return null;
        const birth = new Date(birthDate);
        const endDate = deathDate ? new Date(deathDate) : new Date();

        let age = endDate.getFullYear() - birth.getFullYear();
        const monthDiff = endDate.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && endDate.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    }, []);

    const age = React.useMemo(() => {
        if (!castDetailsData?.birthday) return null;
        return calculateAge(castDetailsData.birthday, castDetailsData?.deathday);
    }, [castDetailsData?.birthday, castDetailsData?.deathday, calculateAge]);

    const handleResize = useCallback(() => {
        if (!infoRef.current) return;

        const currentViewportWidth = window.innerWidth;
        const infoHeight = infoRef.current.clientHeight;

        let bioOffset;
        if (infoHeight <= 96) {
            bioOffset = '96px';
        } else if (infoHeight <= 120) {
            bioOffset = '120px';
        } else {
            bioOffset = `${infoHeight}px`;
        }
        document.documentElement.style.setProperty(
            '--biography-height-offset',
            bioOffset
        );

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
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    const fetchWikipediaBio = async (actorName) => {
        if (!actorName) return null;
        const searchTerm = encodeURIComponent(actorName);
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&titles=${searchTerm}&exintro=true&explaintext=true`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            const pages = data.query?.pages;
            if (!pages) return null;

            const pageId = Object.keys(pages)[0];
            if (pageId === '-1') return null;

            return pages[pageId]?.extract || null;
        } catch (error) {
            console.error('Error fetching Wikipedia biography:', error);
            return null;
        }
    };

    const {
        data: wikipediaBio,
        isLoading: wikipediaBioLoading,
        error: wikipediaBioError
    } = useQuery({
        queryKey: ['wikipediaBio', castDetailsData?.name],
        queryFn: () => fetchWikipediaBio(castDetailsData?.name),
        enabled: !!castDetailsData?.name
    });

    const handleModalClickOutside = useCallback(
        (event) => {
            if (
                isBioModalOpen &&
                bioModalRef.current &&
                !bioModalRef.current.contains(event.target)
            ) {
                handleCloseBioModal();
            }
        },
        [isBioModalOpen, handleCloseBioModal]
    );

    useEffect(() => {
        if (renderModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [renderModal]);

    useEffect(() => {
        if (isBioModalOpen) {
            document.addEventListener('mousedown', handleModalClickOutside);
        } else {
            document.removeEventListener('mousedown', handleModalClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleModalClickOutside);
        };
    }, [isBioModalOpen, handleModalClickOutside]);

    const handleBioSourceChange = (event) => {
        setBioSource(event.target.value);
    };

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
                            {castDetailsData?.deathday ? (
                                <span
                                    title={new Date(
                                        castDetailsData.deathday
                                    ).toLocaleDateString('en-GB')}
                                >
                                    Passed away at {age}
                                    <sup>
                                        <svg className="cast-member-details-page__metadata-icon">
                                            <use xlinkHref={`${sprite}#help`} />
                                        </svg>
                                    </sup>
                                </span>
                            ) : (
                                castDetailsData?.birthday && (
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
                                )
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

                        <div className="cast-member-details-page__details-container">
                            <DynamicButton
                                className="cast-member-details-page__details-button"
                                onClick={handleOpenBioModal}
                            >
                                Biography
                            </DynamicButton>

                            <DynamicButton className="cast-member-details-page__details-button">
                                Awards
                            </DynamicButton>

                            <DynamicButton className="cast-member-details-page__details-button">
                                Socials
                            </DynamicButton>
                        </div>
                        {renderModal && (
                            <div
                                className={`cast-member-details-page__bio-modal ${isBioModalOpen ? 'open' : ''}`}
                                ref={bioModalRef}
                            >
                                <div className="cast-member-details-page__bio-modal-content">
                                    <div className="cast-member-details-page__bio-modal-header">
                                        <div className="cast-member-details-page__bio-modal-header--left-container">
                                            <p className="cast-member-details-page__bio-modal-title">
                                                Biography
                                            </p>
                                            <CustomDropdown
                                                bioSource={bioSource}
                                                setBioSource={setBioSource}
                                            />
                                        </div>

                                        <DynamicButton
                                            className="cast-member-details-page__bio-modal-close-button"
                                            onClick={handleCloseBioModal}
                                        >
                                            <svg className="cast-member-details-page__bio-modal-close-icon">
                                                <use xlinkHref={`${sprite}#close`} />
                                            </svg>
                                        </DynamicButton>
                                    </div>

                                    {bioSource === 'tmdb' ? (
                                        castDetailsLoading ? (
                                            <div>Loading biography from TMDB...</div>
                                        ) : castDetailsError ||
                                          !castDetailsData?.biography ? (
                                            <div>Biography not found on TMDB.</div>
                                        ) : (
                                            <div className="cast-member-details-page__biography-text-container">
                                                <p className="cast-member-details-page__biography-text">
                                                    {castDetailsData.biography}
                                                </p>
                                            </div>
                                        )
                                    ) : bioSource === 'wikipedia' ? (
                                        wikipediaBioLoading ? (
                                            <div>Loading from Wikipedia...</div>
                                        ) : wikipediaBioError || !wikipediaBio ? (
                                            <div>Nothing found on Wikipedia.</div>
                                        ) : (
                                            <div className="cast-member-details-page__biography-text-container">
                                                <p className="cast-member-details-page__biography-text">
                                                    {wikipediaBio}
                                                </p>
                                            </div>
                                        )
                                    ) : null}
                                </div>
                            </div>
                        )}
                        {castCreditsData && castCreditsData.cast && (
                            <div className="filmography__section">
                                <div className="filmography__header">
                                    <p className="filmography__title">
                                        Filmography
                                        <DynamicButton className="filmography__count">
                                            {numberOfMedia}
                                        </DynamicButton>
                                        <svg className="filmography__heading-icon">
                                            <use xlinkHref={`${sprite}#arrow-forward`} />
                                        </svg>
                                    </p>
                                    {/* <DynamicButton className="filmography__view-full-list-button">
                                        Movies & TV shows
                                    </DynamicButton> */}
                                </div>

                                <MediaScroller />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const CustomDropdown = ({ bioSource, setBioSource }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleOptionClick = (value) => {
        setBioSource(value);
        setIsOpen(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <div className="custom-dropdown__button" onClick={toggleOpen}>
                {bioSource === 'tmdb' ? 'TMDB' : 'Wikipedia'}
                <svg className="custom-dropdown__icon">
                    <use xlinkHref={`${sprite}#arrow-dropdown`} />
                </svg>
            </div>
            <div className={`custom-dropdown__options ${isOpen ? 'open' : ''}`}>
                <div
                    className="custom-dropdown__option"
                    onClick={() => handleOptionClick('tmdb')}
                >
                    TMDB
                </div>
                <div
                    className="custom-dropdown__option"
                    onClick={() => handleOptionClick('wikipedia')}
                >
                    Wikipedia
                </div>
            </div>
        </div>
    );
};
