/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import useTabStore from '../../store/tabStore';

export default function Sidebar({ children, onClick }) {
    const { isSidebarOpen, toggleSidebar } = useTabStore();

    const handleClick = useCallback(() => {
        toggleSidebar();
        onClick();
    }, [onClick, toggleSidebar]);

    return (
        <div
            className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
            onClick={handleClick}
        >
            <div className="sidebar-nav-links-container">{children}</div>
        </div>
    );
}
