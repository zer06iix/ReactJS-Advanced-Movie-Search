/* eslint-disable react/prop-types */
const VoteAverage = ({ voteAverage }) => {
    const ratingColor =
        voteAverage > 8
            ? '#34ff19'
            : voteAverage > 6.9
              ? 'yellowgreen'
              : voteAverage > 5
                ? 'orange'
                : voteAverage > 3
                  ? 'red'
                  : 'darkred';

    return (
        <div className="carousel-detail-rating">
            <span
                className="rating-span"
                style={{
                    color: ratingColor,
                    fontWeight: 'bold',
                    fontSize: '20px'
                }}
            >
                {voteAverage.toFixed(1)}
            </span>
        </div>
    );
};

export default VoteAverage;
