/* eslint-disable no-unused-vars */
import { useState } from "react"

export default function Navbar() {

	const [activeTab, setActiveTab] = useState("Home");

	const handleActiveTab = (tab) => {
		setActiveTab(tab);
	}

	return (
		<div className="text-white flex justify-center nav-tabs-container">
			<a 
				onClick={() => handleActiveTab("Home")}
				className={`${ activeTab === "Home" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-10 py-10 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
			>
				Home
			</a>
			<a 
				href="#Popular"
				onClick={() => handleActiveTab("Popular")}
				className={`${activeTab === "Popular" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-10 py-10 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
			>
				Popular
			</a>
			<a 
				href="#Most-Rated" 
				onClick={() => handleActiveTab("MostRated")}
				className={`${activeTab === "MostRated" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-10 py-10 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
			>
				Most Rated
			</a>
			<a 
				href="#Watchlist" 
				onClick={() => handleActiveTab("WatchList")}
				className={`${activeTab === "WatchList" ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-10 py-10 mr-[10rem] text-lg font-medium transition-colors duration-300 ease transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
			>
				Watch list
			</a>
			<div className="searchbar-container px-10 py-10">
				<input 

					className="bg-gray pr-[8rem] px-2 py-1 rounded-full placeholder:text-gray-light focus:outline-none"

					type="text" 

					placeholder="Search" 

				/>
			</div>
		</div>
	)
}