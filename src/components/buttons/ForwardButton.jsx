/* eslint-disable react/prop-types */
export default function ForwardButton({className}) {
    return (  
        <button>
            <svg  
                viewBox="0 -960 960 960"  
                width="80"  
                height="80"
                fill="white"
                className={className}
                >  
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>  
            </svg>
        </button>
      );  
}