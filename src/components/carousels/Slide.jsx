/* eslint-disable react/prop-types */
const Slide = ({ slide }) => {
    const imageUrl = slide?.poster_path
        ? `https://image.tmdb.org/t/p/w500${slide.poster_path}`
        : '/public/imagePlaceholder.png'

    if (!slide) {
        return <img src='/public/imagePlaceholder.png' alt='Placeholder' />
    }

    return (
        <div className="carousel-cards">
            <img className="carousel-images" src={imageUrl} alt={slide.title} />
            <div className="carousel-detail-bg">
                <p className="carousel-detail-title">{slide.title}</p>
                <p className="carousel-detail-rating"><span className="rating-span">{slide.vote_average.toFixed(1)}</span>/10 Rating</p>
            </div>
        </div>
    )
}

export default Slide