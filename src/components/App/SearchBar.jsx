import SearchButton from "../buttons/SearchButton";
import SearchInput from "./SearchInput";


export default function SearchBar() {
    return (
        <div className="searchbar-container">
            <SearchInput className="searchbar-input" />
            <SearchButton className="searchbar-btn" />
        </div>
    );
}
