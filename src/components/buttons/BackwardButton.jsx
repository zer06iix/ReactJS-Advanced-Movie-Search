/* eslint-disable react/prop-types */
export default function BackwardButton({className}) {
    return (  
        <button>
            <svg  
                viewBox="0 -960 960 960"  
                width="80"  
                height="80" 
                fill="white"
                className={className}
                >  
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>  
            </svg>  
        </button>
      );  
}