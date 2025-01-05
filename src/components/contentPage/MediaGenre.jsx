import PropTypes from 'prop-types';

const MediaGenre = ({ genreNames }) => {
    return (
        <div className="genre-container">
            {genreNames.map((name, index) => (
                <a key={index} className="genre-item">
                    {name}
                </a>
            ))}
        </div>
    );
};

MediaGenre.propTypes = {
    genreNames: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default MediaGenre;
