/* eslint-disable react/prop-types */

const SearchInput = ({ value, onChange, className }) => {
    return (
        <input placeholder="Search what you want..." type="text" className={className} value={value} onChange={onChange} />
    );
};

export default SearchInput;
