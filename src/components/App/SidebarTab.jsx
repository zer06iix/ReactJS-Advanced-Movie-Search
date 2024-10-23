/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import useTabStore from "../../store/tabStore"



export default function SidebarTab({ path, children }) {

    const { activeTab, handleActiveTab } = useTabStore()

    return(
        <Link 
            to={path}
            onClick={() => handleActiveTab(children)}
            className={`${activeTab === children ? 'text-blue-light hover:text-blue-light' : 'text-white'} block px-4 py-2 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
        >
            {children}
        </Link>
    )
}