/* eslint-disable react/prop-types */

export default function ExpanderButton({ isExpanded, onClick }) {
    return (
        <>
            <button className="expander" onClick={onClick}>
                {isExpanded ? 'Collapse' : 'Expand'}
            </button>
        </>
    );
}
