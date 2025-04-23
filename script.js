import axios from 'axios'

const videosContainer = document.querySelector('.videos__container')

const ENDPOINT_PROD =
  'https://gist.githubusercontent.com/marcotortolani/46af0e52dc38570ec053a148696bd7fd/raw/1444e1abe3bab7a7b98507166bacc3fe13c53cce/videos.txt'

async function fetchAndDisplayVideos() {
  const urlVideos = import.meta.env.PROD
    ? ENDPOINT_PROD
    : 'http://localhost:3000/videos'

  try {
    const request = await axios.get(urlVideos)

    const videos = await request.data

    videos.forEach((video) => {
      if (video.categoria === '') {
        throw new Error('El video no tiene categoría')
      }

      videosContainer.innerHTML += `
                <li class="videos__item">
                    <iframe src="${video.url}" title="${video.title}" frameborder="0" allowfullscreen></iframe>
                    <div class="video-description">
                        <img class="channel-img" src="${video.image}" alt="Logo del canal">
                        <h3 class="video-title">${video.title}</h3>
                        <p class="channel-title">${video.description}</p>
                        <p class="category" hidden>${video.category}</p>
                    </div>
                </li>
            `
    })
  } catch (error) {
    videosContainer.innerHTML = `<p>Hubo un error al cargar los videos: ${error}</p>`
  }
}

fetchAndDisplayVideos()

const searchBar = document.querySelector('.search__input')

searchBar.addEventListener('input', filterSearch)

function filterSearch() {
  const videoItems = document.querySelectorAll('.videos__item')

  if (searchBar.value !== '') {
    for (let video of videoItems) {
      let title = video.querySelector('.video-title').textContent.toLowerCase()
      let filterValue = searchBar.value.toLowerCase()

      if (!title.includes(filterValue)) {
        video.style.display = 'none'
      } else {
        video.style.display = 'block'
      }
    }
  } else {
    for (let video of videoItems) {
      video.style.display = 'block'
    }
  }
}

const categoryButtons = document.querySelectorAll('.top__item')

categoryButtons.forEach((button) => {
  let categoryName = button.getAttribute('name')
  button.addEventListener('click', () => filterByCategory(categoryName))
})

function filterByCategory(filter) {
  const videoItems = document.querySelectorAll('.videos__item')
  for (let video of videoItems) {
    let category = video.querySelector('.category').textContent.toLowerCase()
    let filterValue = filter.toLowerCase()

    if (!category.includes(filterValue) && filterValue !== 'todo') {
      video.style.display = 'none'
    } else {
      video.style.display = 'block'
    }
  }
}
