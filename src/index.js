import './sass/main.scss';
import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";

const form = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')
const loadMore = document.querySelector('.load-more')

form.addEventListener('submit', getValue)
loadMore.addEventListener('click', getValue)


let formValue = ""
let page = 1
let resultForApi = 0

function getValue(e) {
  e.preventDefault()
  if (formValue !== form.elements.searchQuery.value) {
    gallery.innerHTML = " "
    loadMore.hidden = true
    page = 1
  }
  if (!form.elements.searchQuery.value) {
    return
  }

  
  formValue = form.elements.searchQuery.value
  apiData(formValue)
}


async function apiData(request) {
  const URL = "https://pixabay.com/api/?key=";
  const API_KEY = "27471104-8a1b4a5b4682b30f561432641";
  const PARAMS = `&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;
  
  await axios.get(URL+API_KEY+PARAMS)
  .then(function (response) { 
    if (response.data.total === 0) {
      return Notiflix.Notify.warning("Sorry, there are no images matching your search query. Please try again.")
    }
    resultForApi = response.data.total;
    
    parseData(response);
    loadMore.hidden = false;
    if (page === 1) {
      Notiflix.Notify.success(`We find ${response.data.total} images`)
    }
    
  })
  .catch(function (error) {  
    alert(error)   
  })
  page += 1

  
};

// function parseData(params) {
//   return params.data.hits.map(param => renderCard(param))
// }




// function renderCard({largeImageURL, tags, likes, views, comments, downloads}) {
//   gallery.insertAdjacentHTML('beforeend', 
//   `<div class="photo-card">
//   <a href="${largeImageURL}">
//     <img src="${largeImageURL}" alt="${tags}" loading="lazy" class="img"/>
//   </a>
//   <div class="info">
//     <p class="info-item">
//       <b>Likes ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>Views${views}</br>
//     </p>
//     <p class="info-item">
//       <b>Comments ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads ${downloads}</b>
//     </p>
//   </div>
//   </div>`);
// }


function parseData(response) {
  const markup = response.data.hits
  .map(({largeImageURL, tags, likes, views, comments, downloads}) => {
    return `
    <div class="photo-card">
    <a class="card-link" href="${largeImageURL}">
    <div class="thumb">
      <img src="${largeImageURL}" alt="${tags}" loading="lazy" class="img"/>
    </div>
    </a>
    <div class="info">
      <p class="info-item">
        Likes ${likes}
      </p>
      <p class="info-item">
        Views${views}
      </p>
      <p class="info-item">
        Comments ${comments}
      </p>
      <p class="info-item">
        Downloads ${downloads}
      </p>

    </div>
    </div>`;
  })
  .join("");

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox(".gallery a", { captionDelay: 250, captionsData: 'alt' });
}









