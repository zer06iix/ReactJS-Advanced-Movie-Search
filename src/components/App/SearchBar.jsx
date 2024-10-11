import SearchButton from "../buttons/SearchButton"


export default function SearchBar() {

    return (
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
    )
}