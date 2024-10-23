import { create } from "zustand";

const useTabStore = create((set) => {
    const initialStates = {
        activeTab: sessionStorage.getItem("activeTab") || "Home", //If there wasn't any active tab it will set active tab to home.
        isSidebarOpen: false,
    }

    return {
        ...initialStates,
        handleActiveTab: (tab) => {
            set({ activeTab: tab })
            sessionStorage.setItem("activeTab", tab) // Save to session storage
        },
        toggleSidebar: () => set((state) => ({isSidebarOpen: !state.isSidebarOpen})),
    }
});

export default useTabStore;