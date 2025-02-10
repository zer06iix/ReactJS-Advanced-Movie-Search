import { useState, useRef, useEffect } from 'react';
import sprite from '../../styles/sprite.svg';

export default function NavigationMenu() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const buttonRefs = useRef([]);

    useEffect(() => {
        if (buttonRefs.current[selectedIndex]) {
            buttonRefs.current[selectedIndex].classList.add('selected');
        }
    }, []);

    const handleButtonClick = (index) => {
        if (buttonRefs.current[selectedIndex]) {
            buttonRefs.current[selectedIndex].classList.remove('selected');
        }
        setSelectedIndex(index);
        if (buttonRefs.current[index]) {
            buttonRefs.current[index].classList.add('selected');
        }
    };

    return (
        <div className="navigation-menu-container">
            <div className="navigation-menu-heading">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#segment`} />
                </svg>
                <p className="title">Navigation Menu</p>
            </div>
            <div className="navigation-menu-content">
                <div className="indicator-line">
                    <div
                        className="indicator"
                        style={{ top: `${selectedIndex * 48}px` }}
                    ></div>
                </div>
                {[
                    'Trending Movies',
                    'Trending Shows',
                    'Popular Movies',
                    'Popular Shows',
                    'New Releases',
                    'Coming Soon'
                ].map((item, index) => (
                    <button
                        key={index}
                        ref={(el) => (buttonRefs.current[index] = el)}
                        onClick={() => handleButtonClick(index)}
                        className={`navigation-button`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}
