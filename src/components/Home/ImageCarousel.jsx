import NextButton from '../buttons/NextButton';
import PreviousButton from '../buttons/PreviousButton';
import Slide from './Slide';
import useCarouselStore from '../../store/CarouselStore';

export default function ImageCarousel() {

	const { slides, currentSlide } = useCarouselStore() //These are our states stored in state management

	return (
		<div className="flex items-center justify-center h-[80vh]">
			<div className="relative w-full max-w-4xl mx-auto overflow-hidden">

				<PreviousButton 
					className="absolute fill-white top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
				/>

				<div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
					{slides.map((slide, index) => (
						<Slide key={index} slide={slide} />
					))}
				</div>

				<NextButton
					className="absolute fill-white top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 z-10"
				/>

			</div>
		</div>
	);
};
