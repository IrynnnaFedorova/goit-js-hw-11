const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '25775077-1dbb70afd32e28089af09f690';
export default class GalleryApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchGallery() {
    const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    return fetch(url)
      .then(response => response.json())
      .then((images) => {
        this.incrementPage();
        return images;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}