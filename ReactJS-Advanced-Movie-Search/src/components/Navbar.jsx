// src/components/Navbar.js
import React, { useEffect, useRef, useState } from 'react';

const Navbar = () => {
  const navbarRef = useRef(null);
  const [navItemsWidth, setNavItemsWidth] = useState([]);
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const navbarContainer = navbarRef.current;
    const navItems = Array.from(navbarContainer.children);
    const widths = navItems.map(item => item.getBoundingClientRect().width - 30);
    setNavItemsWidth(widths);

    const indicatorOffset = -15;
    setIndicatorStyle({
      width: `${widths[0] + indicatorOffset}px`,
      transform: `translate(${15 - (indicatorOffset / 2)}px, -25px)`
    });
  }, []);

  const handleNavItemClick = (index) => {
    const widths = navItemsWidth;
    let totalWidth = 0;
    for (let i = 0; i < index; i++) {
      totalWidth += widths[i];
    }
    const position = (30 * index) + 15 + (15 * index) + totalWidth;
    const indicatorOffset = -15;

    setIndicatorStyle({
      width: `${widths[index] + indicatorOffset}px`,
      transform: `translate(${position - (indicatorOffset / 2)}px, -25px)`
    });
    setActiveIndex(index);
  };

  return (
    <div className="nav-tabs-container" ref={navbarRef}>
      {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
        <div
          key={index}
          className="nav-item"
          style={{ color: activeIndex === index ? 'var(--light-blue)' : 'var(--accent-white)' }}
          onClick={() => handleNavItemClick(index)}
        >
          {item}
        </div>
      ))}
      <div className="indicator" style={indicatorStyle}></div>
    </div>
  );
};

export default Navbar;