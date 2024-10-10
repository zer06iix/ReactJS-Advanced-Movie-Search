/* eslint-disable no-unused-vars */
import { useState } from "react"
import MenuIcon from "./buttons/MenuButton";
import SearchButton from "./buttons/SearchButton";

export default function Navbar() {

	const [activeTab, setActiveTab] = useState("Home");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const handleActiveTab = (tab) => {
		setActiveTab(tab);
		setIsSidebarOpen(false);
	}

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	}

	return (
		<div className="text-white flex flex-col md:flex-row justify-center nav-tabs-container">
			<div className="md:hidden flex justify-between items-center px-4 py-2">
				<MenuIcon onClick={toggleSidebar}/>
				<div className="relative">
				<input
					type="text"
					placeholder="Search"
					className="text-[#ffffff] bg-gray pr-[8rem] pl-5 px-2 py-1 rounded-full placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-[#afbbf2] transition duration-300 ease-in-out"
				/>
					<div className="absolute top-0 right-0 rounded-r-full active:bg-[#ffffff4d] h-8 w-10 transition-colors duration-200">
						<SearchButton className="absolute fill-white hover:fill-[#ffffff] transition-colors duration-200 right-2 top-[1rem] transform -translate-y-1/2" />
					</div>
				</div>
			</div>
			<div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
				<div className="bg-gray-800 mt-4 h-full w-64 p-4">
					<a 
						href="#Home"
						onClick={() => handleActiveTab("Home")}
						className={`${ activeTab === "Home" ? 'text-blue-light hover:text-blue-light' : 'text-white'} block px-4 py-2 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
					>
						Home
					</a>
					<a 
						href="#Popular"
						onClick={() => handleActiveTab("Popular")}
						className={`${activeTab === "Popular" ? 'text-blue-light hover:text-blue-light' : 'text-white'} block px-4 py-2 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
					>
						Popular
					</a>
					<a 
						href="#Most-Rated" 
						onClick={() => handleActiveTab("MostRated")}
						className={`${activeTab === "MostRated" ? 'text-blue-light hover:text-blue-light' : 'text-white'} block px-4 py-2 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
					>
						Most Rated
					</a>
					<a 
						href="#Watchlist" 
						onClick={() => handleActiveTab("WatchList")}
						className={`${activeTab === "WatchList" ? 'text-blue-light hover:text-blue-light' : 'text-white'} block px-4 py-2 text-lg font-medium transition-colors duration-300 ease transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
					>
						Watch list
					</a>
				</div>
			</div>
			<div className="hidden md:flex flex-col md:flex-row">
				<a 
					href="#Home"
					onClick={() => handleActiveTab("Home")}
					className={`${ activeTab === "Home" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-4 md:px-10 py-2 md:py-10 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
				>
					Home
				</a>
				<a 
					href="#Popular"
					onClick={() => handleActiveTab("Popular")}
					className={`${activeTab === "Popular" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-4 md:px-10 py-2 md:py-10 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
				>
					Popular
				</a>
				<a 
					href="#Most-Rated" 
					onClick={() => handleActiveTab("MostRated")}
					className={`${activeTab === "MostRated" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-4 md:px-10 py-2 md:py-10 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
				>
					Most Rated
				</a>
				<a 
					href="#Watchlist" 
					onClick={() => handleActiveTab("WatchList")}
					className={`${activeTab === "WatchList" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-4 md:px-10 py-2 md:py-10 mr-0 md:mr-[10rem] text-lg font-medium transition-colors duration-300 ease transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
				>
					Watch list
				</a>
			</div>
			<div className="hidden md:block searchbar-container px-4 md:px-10 py-2 md:py-10">
				<div className="relative">
					<input
						type="text"
						placeholder="Search"
						className="text-[#ffffff] bg-gray pr-[8rem] pl-5 px-2 py-1 rounded-full placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-[#afbbf2] transition duration-300 ease-in-out"
					/>
					<div className="absolute top-0 right-0 rounded-r-full active:bg-[#ffffff4d] h-8 w-10 transition-colors duration-200">
						<SearchButton className="absolute fill-white hover:fill-[#ffffff] transition-colors duration-200 right-2 top-[1rem] transform -translate-y-1/2" />
					</div>
				</div>
			</div>
		</div>
	)
}