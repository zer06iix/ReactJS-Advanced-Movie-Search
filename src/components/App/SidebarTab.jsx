/* eslint-disable react/prop-types */
export default function SidebarTab({ href, activeTab, setActiveTab, children }) {


    return(
        <a 
            href={href}
            onClick={() => setActiveTab(children)}
            className={`${activeTab === children ? 'text-blue-light hover:text-blue-light' : 'text-white'} block px-4 py-2 text-lg font-medium transition-colors duration-300 ease-in-out transform transition-transform duration-250 hover:cursor-pointer hover:-translate-y-0.5`}
        >
            {children}
        </a>
    )
}