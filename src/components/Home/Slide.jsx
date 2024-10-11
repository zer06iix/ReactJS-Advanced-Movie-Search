/* eslint-disable react/prop-types */
export default function Slide({ slide }){
    return(
        <div className="min-w-full relative">
            <img
                className="w-full h-96 object-cover"
                src={slide.path}
                alt={slide.title}
            />
            <div className="absolute bottom-5 left-5 bg-black bg-opacity-50 text-white p-3 rounded">
                <p className="text-lg font-semibold">{slide.title}</p>
                <p className="text-sm">{slide.rating}/10 Rating</p>
            </div>
	    </div>
    )
}