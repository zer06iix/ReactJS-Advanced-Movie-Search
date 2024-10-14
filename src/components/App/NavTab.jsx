/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"


export default function NavTab({ to, activeTab, setActiveTab, children }) {


    return (
        <Link
			to={to}
			onClick={() => setActiveTab(children)}
			className={`${activeTab === children ? 'text-blue-light hover:text-blue-light' : 'text-white'} px-4 mr-10 md:px-10 py-2 md:py-10 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
		>
			{children}
		</Link>
    )
}