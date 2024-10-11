/* eslint-disable react/prop-types */
export default function Sidebar({ children, isSidebarOpen }) {
    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
            <div className="bg-gray-800 mt-4 h-full w-64 p-4">
                {children}
            </div>
        </div>
    );
}