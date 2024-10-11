/* eslint-disable react/prop-types */

export default function MenuButton({onClick}) {
    return (
        <button onClick={onClick}>
            <svg
                width="33px" 
                height="33px" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                stroke="#e6e6e6" 
                data-darkreader-inline-stroke="" 
                style={{ '--darkreader-inline-stroke': '#e5e2dc' }}
            >
                <g id="SVGRepo_bgCarrier" 
                    strokeWidth="0"
                >
                </g>
                <g id="SVGRepo_tracerCarrier" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                >
                </g>
                <g id="SVGRepo_iconCarrier"> 
                    <path 
                        fill="#ffffff" 
                        fillRule="evenodd" 
                        d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z" 
                        data-darkreader-inline-fill="" 
                        style={{ '--darkreader-inline-fill': '#080b0c' }}
                    >
                    </path> 
                </g>
            </svg>
        </button>
    )
}