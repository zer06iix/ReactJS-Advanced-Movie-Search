import useCarouselStore from "../../store/CarouselStore";

/* eslint-disable react/prop-types */
export default function NextButton({ className }) {

    const { nextSlide } = useCarouselStore();

    return (  
        <button
            onClick={nextSlide}
            className={className}
            style={{ zIndex: 10 }}
        >
            <svg className="relative w-7  h-7 active:translate-x-1 transition-color duration-200 active:fill-[#afbbf2]" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
        </button>
      );  
}