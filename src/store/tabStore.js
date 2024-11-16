import { create } from 'zustand';

const useTabStore = create((set) => {
    const tabs = ['Home', 'Popular', 'Most Rated', 'Watch list'];
    const initialStates = {
        activeTab: sessionStorage.getItem('activeTab') || 'Home',
        activeTabIndex: parseInt(sessionStorage.getItem('activeTabIndex')) || 0,
        isSidebarOpen: false,
        tabWidths: [0, 0, 0, 0] // Array to store the widths of each tab
    };

    return {
        ...initialStates,
        tabs,
        handleActiveTab: (tab) => {
            const newActiveTabIndex = tabs.indexOf(tab);
            set({ activeTab: tab, activeTabIndex: newActiveTabIndex });
            sessionStorage.setItem('activeTab', tab);
            sessionStorage.setItem('activeTabIndex', newActiveTabIndex);
        },
        toggleSidebar: () =>
            set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

        // Update a specific tab's width in the state
        updateTabWidth: (index, width) =>
            set((state) => {
                const newTabWidths = [...state.tabWidths];
                newTabWidths[index] = width;
                return { tabWidths: newTabWidths };
            }),

        setActiveTabFromLocation: (location) => {
            const path = location.pathname;
            let newActiveTab = 'Home'; // Default tab

            if (path === '/popular') {
                newActiveTab = 'Popular';
            } else if (path === '/most-rated') {
                newActiveTab = 'Most Rated';
            } else if (path === '/watchlist') {
                newActiveTab = 'Watch list';
            } else if (path.startsWith('/movie')) {
                newActiveTab = null; // Set to null for movie pages
            }

            set({ activeTab: newActiveTab });
            sessionStorage.setItem('activeTab', newActiveTab);
        }
    };
});

export default useTabStore;
