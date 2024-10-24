import useCarouselStore from "../../store/carouselStore";

/* eslint-disable react/prop-types */
export default function PreviousButton({ className }) {

    const { prevSlide } = useCarouselStore();

    return (  
        <button
            onClick={prevSlide}
            className={className}
            style={{ zIndex: 10 }}
        >
            <svg className="w-7 h-7 active:-translate-x-1 transition-color duration-200 active:fill-[#afbbf2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
        </button>
      );  
}