/* eslint-disable no-unused-vars */
import MenuButton from "../buttons/MenuButton";
import SearchBar from "./SearchBar";
import NavTab from "./NavTab";
import Sidebar from "./Sidebar";
import SidebarTab from "./SidebarTab";

export default function Navbar() {

    return (
        <div className="text-white flex flex-col md:flex-row justify-center nav-tabs-container">

            <div className="md:hidden flex justify-between items-center px-4 py-2">
                <MenuButton />
                <SearchBar />
            </div>

            <div className="hidden md:flex flex-col md:flex-row">
                <NavTab path="/" >Home</NavTab> 
                <NavTab path="/popular" >Popular</NavTab> 
                <NavTab path="/most-Rated" >Most Rated</NavTab> 
                <NavTab path="/watchlist" >Watch list</NavTab> 
            </div>
            
            <Sidebar>
                <SidebarTab path="/" >Home</SidebarTab> 
                <SidebarTab path="/popular" >Popular</SidebarTab> 
                <SidebarTab path="/most-rated" >Most Rated</SidebarTab> 
                <SidebarTab path="/watchlist" >Watch list</SidebarTab> 
            </Sidebar>


			<div className="hidden md:block searchbar-container px-4 md:px-10 py-2 md:py-10">
            	<SearchBar />
			</div>
        </div>
    );
}