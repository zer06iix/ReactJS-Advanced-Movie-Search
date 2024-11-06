import SearchButton from "../buttons/SearchButton";

export default function SearchBar() {
    return (
        <div className="searchbar-container">
            <input
                type="text"
                placeholder="Search"
                className="searchbar-input"
            />
            <SearchButton className="searchbar-btn" />
        </div>
    );
}
