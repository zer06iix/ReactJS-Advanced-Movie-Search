import { create } from "zustand";

const useTabStore = create((set) => ({
    activeTab: "Home",
    isSidebarOpen: false,
    handleActiveTab: (tab) => set({activeTab: tab, isSidebarOpen: false}),
    toggleSidebar: () => set((state) => ({isSidebarOpen: !state.isSidebarOpen})),
}));

export default useTabStore;