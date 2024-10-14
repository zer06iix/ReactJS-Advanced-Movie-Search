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
                <SidebarTab to="/" activeTab={activeTab} setActiveTab={handleActiveTab}>Home</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <SidebarTab to="/popular" activeTab={activeTab} setActiveTab={handleActiveTab}>Popular</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <SidebarTab to="/most-rated" activeTab={activeTab} setActiveTab={handleActiveTab}>Most Rated</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <SidebarTab to="/watchlist" activeTab={activeTab} setActiveTab={handleActiveTab}>Watch list</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
            </Sidebar>

            <div className="hidden md:flex flex-col md:flex-row">
                <NavTab to="/" activeTab={activeTab} setActiveTab={handleActiveTab}>Home</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <NavTab to="/popular" activeTab={activeTab} setActiveTab={handleActiveTab}>Popular</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <NavTab to="/most-Rated" activeTab={activeTab} setActiveTab={handleActiveTab}>Most Rated</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <NavTab to="/watchlist" activeTab={activeTab} setActiveTab={handleActiveTab}>Watch list</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
            </div>

			<div className="hidden md:block searchbar-container px-4 md:px-10 py-2 md:py-10">
            	<SearchBar />
			</div>
        </div>
    );
}