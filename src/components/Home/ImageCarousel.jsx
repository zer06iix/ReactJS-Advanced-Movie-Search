import { useState } from 'react';
import NextButton from '../buttons/NextButton';
import PreviousButton from '../buttons/PreviousButton';
import Slide from './Slide';


export default function ImageCarousel() {
	const slides = [
		{ path: '/imagePlaceholder.png', title: 'Movie Title 1', rating: '6.7' },
		{ path: '/imagePlaceholder.png', title: 'Movie Title 2', rating: '7.2' },
		{ path: '/imagePlaceholder.png', title: 'Movie Title 3', rating: '8.1' },
		{ path: '/imagePlaceholder.png', title: 'Movie Title 4', rating: '5.5' },
		{ path: '/imagePlaceholder.png', title: 'Movie Title 5', rating: '9.0' },
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
						<Slide key={index} slide={slide} />
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
