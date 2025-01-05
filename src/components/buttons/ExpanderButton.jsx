/* eslint-disable react/prop-types */

export default function ExpanderButton({ isExpanded, onClick, className }) {
    return (
        <>
            <button 
                onClick={onClick}
                className={className}
            >
                {isExpanded ? 'Collapse' : 'Expand'}
            </button>
        </>
    );
}
