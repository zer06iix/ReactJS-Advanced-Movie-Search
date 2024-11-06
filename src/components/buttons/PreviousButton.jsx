import PropTypes from 'prop-types';

/* eslint-disable react/prop-types */
export default function PreviousButton({ className, onClick }) {
    return (
        <button
            onClick={onClick}
            className={className}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
        </button>
      )
}

PreviousButton.propTypes = {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
};
