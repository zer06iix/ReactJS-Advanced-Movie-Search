import { useState } from 'react';
import NextButton from './buttons/NextButton';
import PreviousButton from './buttons/PreviousButton';


const Carousel = () => {
	const slides = [
		{ path: '/public/imagePlaceholder.png', title: 'Movie Title 1', rating: '6.7' },
		{ path: '/public/imagePlaceholder.png', title: 'Movie Title 2', rating: '7.2' },
		{ path: '/public/imagePlaceholder.png', title: 'Movie Title 3', rating: '8.1' },
		{ path: '/public/imagePlaceholder.png', title: 'Movie Title 4', rating: '5.5' },
		{ path: '/public/imagePlaceholder.png', title: 'Movie Title 5', rating: '9.0' },
	];

	const [currentSlide, setCurrentSlide] = useState(0);

	const nextSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
	};

	return (
		<div className="flex items-center justify-center h-[80vh]">
			<div className="relative w-full max-w-4xl mx-auto overflow-hidden">

				<PreviousButton 
					onClick={prevSlide}
					className="absolute fill-white top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
				/>

				<div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
					{slides.map((slide, index) => (
						<div
							key={index}
							className="min-w-full relative"
						>
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
					))}
				</div>

				<NextButton 
					onClick={nextSlide}
					className="absolute fill-white top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
				/>

			</div>
		</div>
	);
};

export default Carousel;