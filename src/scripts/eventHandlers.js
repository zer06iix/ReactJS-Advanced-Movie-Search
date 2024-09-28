import {
  initializeNavbar,
  initializeImageCarousel
} from './domBuilder.js'

export function navbarIndicatorAction() {
  const navbarElements = initializeNavbar()
  const { navItems, navItemsWidth, indicator, indicatorOffset } = navbarElements
  
  let widths = 0
  navItems.forEach((item, i) => {
    if (i !== 0) {
      widths += navItemsWidth[i - 1]
    }
    
    const position = (30 * i) + 15 + (15 * i) + widths
    
    item.addEventListener('click', () => {
      indicator.style.width = `${navItemsWidth[i] + indicatorOffset}px`
      indicator.style.transform = `translate(${position - (indicatorOffset / 2)}px, -25px)`
      
      navItems.forEach(item => {
        item.style.color = 'var(--accent-white)'
      })
      navItems[i].style.color = 'var(--light-blue)'
    })
  })
}

function replaceClasses(element, ...classNames) {
  element.className = ''

  classNames.forEach(className => {
    element.classList.add(className)
  })
}

function getCarouselSlides(track) {
  const currentSlideCenter = track.querySelector('.current-slide-center')
  const currentSlideRight = track.querySelector('.current-slide-right')
  const currentSlideLeft = track.querySelector('.current-slide-left')
  const hiddenSlidesRight = track.querySelectorAll('.hidden-slide-right')
  const hiddenSlidesLeft = track.querySelectorAll('.hidden-slide-left')
  
  return {
    currentSlideCenter,
    currentSlideRight,
    currentSlideLeft,
    hiddenSlidesRight,
    hiddenSlidesLeft,
  }
}

function transitionVisibleSlides(slide, size, direction) {
  const slidesArr = slide.parentElement.querySelectorAll('li')

  if (size === 'large') {
    const fullContainer = slide.querySelector('.carousel-slide-full-container')
    const smallPoster = slide.querySelector('.carousel-small-poster')
    const detailSection = slide.querySelector('.detail')
    
    fullContainer.style.opacity = '1'
    detailSection.style.opacity = '1'
    detailSection.style.transform = 'translate(0, 0%)'
  }
  
  if (size === 'small') {
    const fullContainer = slide.querySelector('.carousel-slide-full-container')
    const smallPoster = slide.querySelector('.carousel-small-poster')
    const detailSection = slide.querySelector('.detail')

    fullContainer.style.opacity = '0'
    detailSection.style.opacity = '0'
    detailSection.style.transform = 'translate(0, 100%)'
  }
}

function transitionHiddenSlides(slide, size, direction) {

}

let imageCarouselIndex = 0
export function imageCarouselAction() {
  const carouselElements = initializeImageCarousel()
  const { track, cards, prevBtn, nextBtn } = carouselElements
    
  prevBtn.addEventListener('click', () => {
    const {
      currentSlideCenter,
      currentSlideRight,
      currentSlideLeft,
      hiddenSlidesRight,
      hiddenSlidesLeft
    } = getCarouselSlides(track)
    
    transitionVisibleSlides(currentSlideCenter, 'small', 'ltr')
    transitionVisibleSlides(currentSlideLeft, 'large', 'ltr')
    
    replaceClasses(currentSlideCenter, 'carousel-slides', 'current-slide-right')
    replaceClasses(currentSlideRight, 'carousel-slides', 'hidden-slides', 'hidden-slide-right')
    replaceClasses(currentSlideLeft, 'carousel-slides', 'current-slide-center')
    replaceClasses(hiddenSlidesRight[0], 'carousel-slides', 'hidden-slides', 'hidden-slide-left')
    replaceClasses(hiddenSlidesLeft[hiddenSlidesLeft.length - 1], 'carousel-slides', 'current-slide-left')
    
    imageCarouselIndex = (imageCarouselIndex === 0) ? (cards.length - 1) : (imageCarouselIndex - 1)
  })
  
  nextBtn.addEventListener('click', () => {
    const {
      currentSlideCenter,
      currentSlideRight,
      currentSlideLeft,
      hiddenSlidesRight,
      hiddenSlidesLeft
    } = getCarouselSlides(track)
    
    transitionVisibleSlides(currentSlideCenter, 'small', 'rtl')
    transitionVisibleSlides(currentSlideRight, 'large', 'rtl')
    
    replaceClasses(currentSlideCenter, 'carousel-slides', 'current-slide-left')
    replaceClasses(currentSlideRight, 'carousel-slides', 'current-slide-center')
    replaceClasses(currentSlideLeft, 'carousel-slides', 'hidden-slides', 'hidden-slide-left')
    replaceClasses(hiddenSlidesRight[0], 'carousel-slides', 'current-slide-right')
    replaceClasses(hiddenSlidesLeft[hiddenSlidesLeft.length - 1], 'carousel-slides', 'hidden-slides', 'hidden-slide-right')
    
    imageCarouselIndex = (imageCarouselIndex === cards.length - 1) ? 0 : (imageCarouselIndex + 1)
  })


  // make sure slides have the correct images when resizing
  // smooth transition for each card
}