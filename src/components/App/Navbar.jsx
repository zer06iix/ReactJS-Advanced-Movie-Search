/* eslint-disable no-unused-vars */
import { useState } from "react";
import MenuIcon from "../buttons/MenuButton";
import SearchBar from "./SearchBar";
import NavTab from "./NavTab";
import Sidebar from "./Sidebar";
import SidebarTab from "./SidebarTab";


export default function Navbar() {
    const [activeTab, setActiveTab] = useState("Home");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleActiveTab = (tab) => {
        setActiveTab(tab);
        setIsSidebarOpen(false); // Close sidebar when a tab is clicked
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="text-white flex flex-col md:flex-row justify-center nav-tabs-container">

            <div className="md:hidden flex justify-between items-center px-4 py-2">
                <MenuIcon onClick={toggleSidebar} />
                <SearchBar />
            </div>

            <Sidebar isSidebarOpen={isSidebarOpen}>
                <SidebarTab href="#Home" activeTab={activeTab} setActiveTab={handleActiveTab}>Home</SidebarTab>
                <SidebarTab href="#Popular" activeTab={activeTab} setActiveTab={handleActiveTab}>Popular</SidebarTab>
                <SidebarTab href="#Most-Rated" activeTab={activeTab} setActiveTab={handleActiveTab}>Most Rated</SidebarTab>
                <SidebarTab href="#Watchlist" activeTab={activeTab} setActiveTab={handleActiveTab}>Watch list</SidebarTab>
            </Sidebar>

            <div className="hidden md:flex flex-col md:flex-row">
                <NavTab href="#Home" activeTab={activeTab} setActiveTab={handleActiveTab}>Home</NavTab>
                <NavTab href="#Popular" activeTab={activeTab} setActiveTab={handleActiveTab}>Popular</NavTab>
                <NavTab href="#Most-Rated" activeTab={activeTab} setActiveTab={handleActiveTab}>Most Rated</NavTab>
                <NavTab href="#Watchlist" activeTab={activeTab} setActiveTab={handleActiveTab}>Watch list</NavTab>
            </div>

			<div className="hidden md:block searchbar-container px-4 md:px-10 py-2 md:py-10">
            	<SearchBar />
			</div>
        </div>
    );
}