import '../src/css/style.css';
import '../src/css/search-field.css';
import '../src/css/gallery.css';
import '../src/css/load-button.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';
import GalleryApi from '../src/js/gallery-img';
import LoadBtn from'../src/js/load-button';
import galleryCard from '../src/templates/gallery-card.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
    form: document.querySelector('form#search-form'),
    inputField: document.querySelector('input.search-form__input'),
    searchButton: document.querySelector('button.search-form__button'),
    gallery: document.querySelector('div.gallery'),
    loadMoreButton: document.querySelector('button.load'),

};

const loadBtn = new LoadBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const galleryApi = new GalleryApi();

refs.form.addEventListener('submit', onSearch);
loadBtn.refs.button.addEventListener('click', fetchGallery);

function onSearch(event) {
    event.preventDefault();

    galleryApi.query = event.currentTarget.elements.searchQuery.value.trim();

    if (galleryApi.query === '') {
        clearAll();
        return Notify.info("Input your search query.");
    }

    loadBtn.show();
    galleryApi.resetPage();
    clearGallery();
    fetchGallery();
}

function fetchGallery() {
    loadBtn.disable();
    galleryApi.fetchGallery()
        .then(imagesArray => {
            galleryDisplay(imagesArray);
            loadBtn.enable();
            smoothScroll();
        })
        .catch(noSuchResult);
};

function galleryDisplay(images) {
    const imagesReturned = images.hits.length;
    const imagesHits = images.totalHits;
    let cardsDisplayed = document.querySelectorAll('div.photo-card').length;

    function statements() {
        // Throwing error on incorrect input query
    if (imagesReturned === 0) {
        throw new Error();
    }

    // If statement for situation when we got more than 40 hits, but less than 500
    if (imagesReturned < CARDS_PER_PAGE && imagesHits > CARDS_PER_PAGE) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        loadBtn.hide();
    }

    // If statement for situation when we got more than 500 hits and reached maximum of them displayed
    if (cardsDisplayed + CARDS_PER_PAGE > 500) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        loadBtn.hide();
        images.hits = images.hits.slice(0, 20);
    }

    // If statement for situation when we got 40 hits or less
    if (imagesHits <= CARDS_PER_PAGE) {
        loadBtn.hide();
    }

    // If statement for notification with amount of hits
    if (cardsDisplayed < 1) {
        Notify.success(`Hooray! We found ${imagesHits} images.`);
        }
    }

    statements();   
    
    refs.gallery.insertAdjacentHTML('beforeend', galleryCard(images));

    spaceBetweenNumbers();
    simpleLightbox();
    lazyLoad();
}

function clearGallery() {
    cardsCount = 0;
    refs.gallery.innerHTML = '';
}

function clearAll() {
    cardsCount = 0;
    refs.gallery.innerHTML = ' ';
    loadBtn.hide();
};

function noSuchResult() {
    clearAll();
    Notify.failure("Sorry, there are no images matching your search query. Please try again.");
};

function simpleLightbox() {
    const galleryHandler = new SimpleLightbox('.photo-card a');
    galleryHandler.on('show.simplelightbox');
    galleryHandler.refresh();
}

function lazyLoad() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    lazyImages.forEach(image => {
        image.addEventListener('load', onImageLoaded, { once: true });
    });
    
    function onImageLoaded(event) {
        event.target.classList.add('appear');
        event.target.classList.add('loaded');
    }
}

// Adding space between numbers
let cardsCount = 0;

function spaceBetweenNumbers() {
    let numbersCount = document.querySelectorAll('span.info-number').length;

    for (let i = cardsCount; i < numbersCount; i += 1){
        const amountEl = document.querySelectorAll('span.info-number')[i];
        amountEl.textContent = Number(amountEl.textContent).toLocaleString();
        cardsCount = i;
    };

    cardsCount += 1;
}

// Adding smooth scroll after clicking on "Load more" button
const CARDS_PER_PAGE = 40;

function smoothScroll() {
    let cardsAmount = document.querySelectorAll('div.photo-card').length;

    if ( cardsAmount > CARDS_PER_PAGE) {
        const { height: cardHeight } = document.querySelector('.gallery')
            .firstElementChild
            .getBoundingClientRect();
        
        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
    }
}

/*const onEntry = entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('pora gryzit eshe')
        }
    })
};
const Option = {};
const observer = new IntersectionObserver(onEntry, Option);
observer.observe( refs.sentinel)*


const observer = new IntersectionObserver(callbak, Option);
const sentinel = document.querySelector('#sentinel');
observer.observe(sentinel);*/