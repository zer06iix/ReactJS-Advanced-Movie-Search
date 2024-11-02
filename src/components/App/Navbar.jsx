import { useState, useEffect } from "react"
import MenuButton from "../buttons/MenuButton"
import SearchBar from "./SearchBar"
import NavTab from "./NavTab"
import Sidebar from "./Sidebar"
import SidebarTab from "./SidebarTab"
import useTabStore from "../../store/tabStore"

export default function Navbar() {
    const [menuButtonOpacity, setMenuButtonOpacity] = useState(1)
    const { isSidebarOpen, toggleSidebar } = useTabStore()

    const handleSidebarClick = () => setMenuButtonOpacity(1)

    const handleSidebarTabClick = () => {
        setMenuButtonOpacity(1)
        toggleSidebar()
    }

    useEffect(() => {
        const handleResize = () => {
            // applies when it's larger than this value (in pixels)
            const widthThreshold = 1000
            if (window.innerWidth > widthThreshold && isSidebarOpen) {
                setMenuButtonOpacity(1)
                toggleSidebar()
            }
        }

        window.addEventListener('resize', handleResize)

        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [isSidebarOpen, toggleSidebar])


    return (
        <nav>
            <div className="nav-container">
                <div className="navbar-left-section">
                    <MenuButton
                        style={{ opacity: menuButtonOpacity }}
                        onClick={() => setMenuButtonOpacity(0)}
                    />

                    <div className="nav-links-container">
                        <NavTab path="/">Home</NavTab>
                        <NavTab path="/popular">Popular</NavTab>
                        <NavTab path="/most-rated">Most Rated</NavTab>
                        <NavTab path="/watchlist">Watch list</NavTab>
                    </div>
                </div>

                <SearchBar />
            </div>

            {isSidebarOpen && ( // Render Sidebar only if it's open
                <Sidebar onClick={handleSidebarClick}>
                    <SidebarTab path="/" onClick={handleSidebarTabClick}>Home</SidebarTab>
                    <SidebarTab path="/popular" onClick={handleSidebarTabClick}>Popular</SidebarTab>
                    <SidebarTab path="/most-rated" onClick={handleSidebarTabClick}>Most Rated</SidebarTab>
                    <SidebarTab path="/watchlist" onClick={handleSidebarTabClick}>Watch list</SidebarTab>
                </Sidebar>
            )}
        </nav>
    )
}
