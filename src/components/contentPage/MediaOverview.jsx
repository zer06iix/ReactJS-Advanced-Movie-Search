import PropTypes from 'prop-types';

const MediaOverview = ({
    media,
    showOverview,
    isExpanded,
    setIsExpanded,
    showExpanderBtn,
    overviewSection,
    expanderBtnRef,
    infoRef,
    shadowOverlayRef
}) => {
    return (
        <div
            ref={overviewSection}
            style={{ display: showOverview ? 'block' : 'none' }}
            className={`overview ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
            <div className="heading">
                <p className="title">Overview</p>
                {showExpanderBtn && (
                    <button
                        ref={expanderBtnRef}
                        onClick={() => {
                            setIsExpanded(!isExpanded);
                            if (shadowOverlayRef.current) {
                                shadowOverlayRef.current.style.opacity = !isExpanded
                                    ? '0'
                                    : '1';
                            }
                        }}
                        className={`expander ${isExpanded ? 'expanded' : 'collapsed'}`}
                    >
                        <p>Expand</p>
                        <p>Collapse</p>
                    </button>
                )}
            </div>

            <p ref={infoRef} className={`info ${isExpanded ? 'expanded' : 'collapsed'}`}>
                {media.overview}
            </p>
            <div ref={shadowOverlayRef} className="shadow-overlay"></div>
        </div>
    );
};

// Props validation
MediaOverview.propTypes = {
    media: PropTypes.shape({
        overview: PropTypes.string.isRequired
    }).isRequired,
    showOverview: PropTypes.bool.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    setIsExpanded: PropTypes.func.isRequired,
    showExpanderBtn: PropTypes.bool.isRequired,
    overviewSection: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired,
    expanderBtnRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired,
    infoRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired,
    shadowOverlayRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired
};

export default MediaOverview;
