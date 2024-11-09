import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTabStore from '../../store/tabStore';

export default function NavTab({ path, children }) {
  const { activeTab, handleActiveTab, updateTabWidth, tabs } = useTabStore();
  const isActive = activeTab === children;
  const tabRef = useRef(null);
  const tabIndex = tabs.indexOf(children); // Find the index of this tab

  useEffect(() => {
    if (tabRef.current) {
      const width = tabRef.current.getBoundingClientRect().width;
      updateTabWidth(tabIndex, width); // Update the tab's width in the store
    }
  }, [tabIndex, updateTabWidth]);

  return (
    <Link
      ref={tabRef}
      to={path}
      onClick={() => handleActiveTab(children)}
      className={`nav-links ${isActive ? 'active' : 'inactive'}`}
    >
      {children}
    </Link>
  );
}
