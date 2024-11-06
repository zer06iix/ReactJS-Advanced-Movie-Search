import { create } from "zustand";

const useTabStore = create((set) => {
    const initialStates = {
        // If there wasn't any active tab it will set active tab to home.
        activeTab: sessionStorage.getItem("activeTab") || "Home",
        isSidebarOpen: false,
    };

    return {
        ...initialStates,
        handleActiveTab: (tab) => {
            set({ activeTab: tab });
            sessionStorage.setItem("activeTab", tab); // Save to session storage
        },
        toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    };
});

export default useTabStore;