import { create } from 'zustand';

const useTabStore = create((set) => {
    const tabs = ['Home', 'Popular', 'Most Rated', 'Watch list'];
    const initialStates = {
        activeTab: sessionStorage.getItem('activeTab') || 'Home',
        activeTabIndex: parseInt(sessionStorage.getItem('activeTabIndex')) || 0,
        isSidebarOpen: false,
        tabWidths: [0, 0, 0, 0], // Array to store the widths of each tab
        menuButtonOpacity: 1, // Moved from Navbar
        activeTabWidth: 0 // Moved from Navbar
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

        updateTabWidth: (index, width) =>
            set((state) => {
                const newTabWidths = [...state.tabWidths];
                newTabWidths[index] = width;
                return { tabWidths: newTabWidths };
            }),

        setActiveTabFromLocation: (location) => {
            const path = location.pathname;
            let newActiveTab = 'Home'; // Default tab
            let newActiveTabIndex = 0; // Default index
        
            if (path === '/popular') {
                newActiveTab = 'Popular';
                newActiveTabIndex = 1;
            } else if (path === '/most-rated') {
                newActiveTab = 'Most Rated';
                newActiveTabIndex = 2;
            } else if (path === '/watchlist') {
                newActiveTab = 'Watch list';
                newActiveTabIndex = 3;
            } else if (path.startsWith('/movie')) {
                newActiveTab = null;
                newActiveTabIndex = -1; // Use an invalid index to represent no active tab
            }
        
            set({ activeTab: newActiveTab, activeTabIndex: newActiveTabIndex });
            sessionStorage.setItem('activeTab', newActiveTab);
            sessionStorage.setItem('activeTabIndex', newActiveTabIndex);
        },

        // New methods to update menuButtonOpacity and activeTabWidth
        setMenuButtonOpacity: (opacity) => set({ menuButtonOpacity: opacity }),
        setActiveTabWidth: (width) => set({ activeTabWidth: width })
    };
});

export default useTabStore;