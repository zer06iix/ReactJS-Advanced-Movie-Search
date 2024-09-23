/**
 * Initializes the navigation bar by generating an indicator and calculating 
 * the widths of the navigation items.
 *
 * This function selects the navigation items from the DOM, calculates their 
 * widths after adjusting for a fixed offset, and creates an indicator div 
 * that reflects the width of the first navigation item. The indicator is 
 * then appended to the navbar container.
 * 
 * @function
 * @returns {Object} An object containing:
 *   @property {HTMLElement[]} navItems - An array of navigation item elements.
 *   @property {number[]} navItemsWidth - An array of widths for each navigation item,
 *   adjusted by subtracting 30 pixels (inline-padding of each item).
 *   @property {HTMLElement} indicator - The indicator div element for the navbar.
 */
export function initializeNavbar() {
  const navbarContainer = document.querySelector('.nav-tabs-container')
  const navItems = Array.from(navbarContainer.children)
  const navItemsWidth = []
  const indicatorOffset = -15
  
  for (let i = 0; i < navItems.length; i++) {
    navItemsWidth.push(navItems[i].getBoundingClientRect().width - 30)
  }
  
  const indicator = document.createElement('div')
  indicator.classList.add('indicator')
  indicator.style.width = `${navItemsWidth[0] + indicatorOffset}px`
  indicator.style.transform = `translate(${15 - (indicatorOffset / 2)}px, -25px)`
  navbarContainer.appendChild(indicator)
  
  return { navItems, navItemsWidth, indicator, indicatorOffset }
}

/**
 * Builds the image carousel by dynamically generating HTML for the images.
 * Retrieves file paths from a predefined list and initializes the carousel track 
 * with the images, including their respective details and controls for navigation.
 * 
 * @function buildImageCarousel
 * @returns {Object} An object containing:
 *    @property {HTMLElement} track - The carousel track element containing the image slides.
 *    @property {Array<HTMLElement>} cards - An array of slides (li elements) in the carousel.
 *    @property {HTMLElement} prevBtn - The button element to navigate to the previous slide.
 *    @property {HTMLElement} nextBtn - The button element to navigate to the next slide.
 *    @property {HTMLElement} pagination - The pagination element for the carousel.
 */
export function initializeImageCarousel() {
  //  TODO: Future enhancements
  // - Fetch image filenames dynamically from the folder
  // - Add a 'date' property for movie details
  const imageDetails = [  
    { path: 'imagePlaceholder.png', title: 'Movie Title 1', rating: '6.7' },  
    { path: 'imagePlaceholder.png', title: 'Movie Title 2', rating: '7.2' },  
    { path: 'imagePlaceholder.png', title: 'Movie Title 3', rating: '8.1' },  
    { path: 'imagePlaceholder.png', title: 'Movie Title 4', rating: '5.5' },  
    { path: 'imagePlaceholder.png', title: 'Movie Title 5', rating: '9.0' },  
  ]
  const track = document.querySelector('.carousel-track')
  
  const hiddenSlidesCount = imageDetails.length - 3
  const slidesHTML = imageDetails.map((item, i) => {  
    return `  
      <li class="carousel-slides ${
        i === 0 ? 'current-slide-center' :
        i === 1 ? 'current-slide-right' :
        i === imageDetails.length - 1 ? 'current-slide-left' :
        i < Math.ceil(hiddenSlidesCount / 2) + 2
        ? 'hidden-slides hidden-slide-right' : 'hidden-slides hidden-slide-left'
      }">
        <div class="carousel-slide-full-container">
          <img class="carousel-images carousel-large-poster" src="../src/Images/${item.path}" alt="">
          <div class="shadow-overlay"></div>
          <div class="detail">
            <div class="left-section">
              <p class="title">${item.title}</p>
              <p class="rating">${item.rating}/10 Rating</p>
            </div>
            <button class="save-btn">Fav</button>
          </div>
        </div>
        <img class="carousel-images carousel-small-poster" src="../src/Images/${item.path}" alt="">
      </li>
    `
  }).join('')
  
  track.innerHTML = slidesHTML
  
  const cards = Array.from(track.children)
  const prevBtn = document.querySelector('.move-btn-left')
  const nextBtn = document.querySelector('.move-btn-right')

  return { track, cards, prevBtn, nextBtn }
}


// const placeholderImage = '../public/imagePlaceholder.png'
// export async function initializeImageCarousel() {  
//   // Display the placeholder image until images are fetched  
//   const imageDetails = getDefaultImageDetails()

//   // Render the default images in the carousel  
//   const track = document.querySelector('.carousel-track')
//   renderCarouselSlides(track, imageDetails)

//   // Fetch and update images from the API  
//   const fetchedImages = await getCarouselImages()

//   // Update the carousel with fetched images  
//   renderCarouselSlides(track, fetchedImages)
// }

// function renderCarouselSlides(track, imageDetails) {
//   const hiddenSlidesCount = imageDetails.length - 3
//   const slidesHTML = imageDetails.map((item, i) => {
//     return `
//       <li class="carousel-slides ${
//         i === 0 ? 'current-slide-center' :
//         i === 1 ? 'current-slide-right' :
//         i === imageDetails.length - 1 ? 'current-slide-left' :
//         i < Math.ceil(hiddenSlidesCount / 2) + 2
//         ? 'hidden-slides hidden-slide-right' : 'hidden-slides hidden-slide-left'
//       }">
//         <div class="carousel-slide-full-container">
//           <img class="carousel-images carousel-large-poster" src="${item.path}" alt="${item.title}">
//           <div class="shadow-overlay"></div>
//           <div class="detail">
//             <div class="left-section">
//               <p class="title">${item.title}</p>
//               <p class="rating">${item.rating}/10 Rating</p>
//             </div>
//             <button class="save-btn">Fav</button>
//           </div>
//         </div>
//         <img class="carousel-images carousel-small-poster" src="${item.path}" alt="${item.title}">
//       </li>
//     `
//   }).join('')
  
//   track.innerHTML = slidesHTML
// }

// function getDefaultImageDetails() {
//   return [
//     { path: placeholderImage, title: 'Loading...', rating: 'N/A' },
//     { path: placeholderImage, title: 'Loading...', rating: 'N/A' },
//     { path: placeholderImage, title: 'Loading...', rating: 'N/A' },
//     { path: placeholderImage, title: 'Loading...', rating: 'N/A' },
//     { path: placeholderImage, title: 'Loading...', rating: 'N/A' },
//   ]
// }

// async function getCarouselImages() {  
//   let imageDetails = []

//   try {  
//     const response = await fetch('https://api.example.com/images')  // Replace with actual API URL  
//     if (!response.ok) {
//       throw new Error('Failed to fetch images from the API')
//     }  

//     const data = await response.json()
//     imageDetails = data.map(item => ({  
//       path: item.path || placeholderImage,
//       title: item.title || 'No Title',
//       rating: item.rating || 'N/A',
//     }))

//   } catch (error) {
//     console.error('Error fetching images:', error)
//     imageDetails = [
//       { path: placeholderImage, title: 'No Image Loaded', rating: 'N/A' },
//     ]
//   }  

//   return imageDetails
// }
