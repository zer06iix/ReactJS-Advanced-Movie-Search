/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import useTabStore from "../../store/tabStore"

export default function NavTab({ path, children }) {

	const { activeTab, handleActiveTab } = useTabStore();

	const isActive = activeTab === children

	return (
		<Link
			to={path}
			onClick={() => handleActiveTab(children)}
			className={`nav-links ${isActive ? 'active' : 'inactive'}`}
		>
			{children}
		</Link>
	)
}
