/* eslint-disable react/prop-types */
export default function Slide({ slide }) {
    const imageUrl = slide.poster_path 
        ? `https://image.tmdb.org/t/p/w500${slide.poster_path}` 
        : '/public/imagePlaceholder.png'; // Replace with your placeholder image path

    return (
        <div className="min-w-full relative">
            <img
                className="w-{900px} h-[700px] object-fit"
                src={imageUrl}
                alt={slide.title}
            />
            <div className="absolute bottom-5 left-5 bg-gray-dark bg-opacity-80 text-white p-3 rounded">
                <p className="text-lg font-semibold">{slide.title}</p>
                <p className="text-sm">{slide.vote_average}/10 Rating</p>
            </div>
        </div>
    );
}