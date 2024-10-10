/* eslint-disable react/prop-types */
export default function PreviousButton({className, onClick}) {
    return (  
        <button
            onClick={onClick}
            className={className}
            style={{ zIndex: 10 }}
        >
            <svg className="w-5 h-5 active:-translate-x-1 transition-color duration-200 active:fill-[#afbbf2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
        </button>
      );  
}