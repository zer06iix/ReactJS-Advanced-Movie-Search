/* eslint-disable no-unused-vars */
import MenuIcon from "../buttons/MenuButton";
import SearchBar from "./SearchBar";
import NavTab from "./NavTab";
import Sidebar from "./Sidebar";
import SidebarTab from "./SidebarTab";
import useTabStore from "../../store/tabStore";

export default function Navbar() {
    const { activeTab, handleActiveTab, isSidebarOpen, toggleSidebar} = useTabStore(); //These are our states stored in state management

    return (
        <div className="text-white flex flex-col md:flex-row justify-center nav-tabs-container">

            <div className="md:hidden flex justify-between items-center px-4 py-2">
                <MenuIcon onClick={toggleSidebar} />
                <SearchBar />
            </div>

            <Sidebar isSidebarOpen={isSidebarOpen}>
                <SidebarTab to="/" activeTab={activeTab} handleActiveTab={handleActiveTab}>Home</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <SidebarTab to="/popular" activeTab={activeTab} handleActiveTab={handleActiveTab}>Popular</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <SidebarTab to="/most-rated" activeTab={activeTab} handleActiveTab={handleActiveTab}>Most Rated</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <SidebarTab to="/watchlist" activeTab={activeTab} handleActiveTab={handleActiveTab}>Watch list</SidebarTab> {/* to is an attribute for linking tabs to each other in react-router */}
            </Sidebar>

            <div className="hidden md:flex flex-col md:flex-row">
                <NavTab to="/" activeTab={activeTab} handleActiveTab={handleActiveTab}>Home</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <NavTab to="/popular" activeTab={activeTab} handleActiveTab={handleActiveTab}>Popular</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <NavTab to="/most-Rated" activeTab={activeTab} handleActiveTab={handleActiveTab}>Most Rated</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
                <NavTab to="/watchlist" activeTab={activeTab} handleActiveTab={handleActiveTab}>Watch list</NavTab> {/* to is an attribute for linking tabs to each other in react-router */}
            </div>

			<div className="hidden md:block searchbar-container px-4 md:px-10 py-2 md:py-10">
            	<SearchBar />
			</div>
        </div>
    );
}