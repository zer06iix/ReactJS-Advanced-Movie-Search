import PropTypes from 'prop-types'

/* eslint-disable react/prop-types */
export default function NextButton({ className, onClick }) {
    return (
        <button
            onClick={onClick}
            className={className}
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
        </button>
    )
}

NextButton.propTypes = {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
}
