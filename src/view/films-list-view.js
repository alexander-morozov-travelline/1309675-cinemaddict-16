import {createElement} from '../render';

const filmList = {
  ALL_FILMS: 'allFilms',
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};

const filmListParams = [
  {
    id: filmList.ALL_FILMS,
    title: 'All movies. Upcoming',
    isExtra: false,
  },
  {
    id: filmList.TOP_RATED,
    title: 'Top rated',
    isExtra: true,
  },
  {
    id: filmList.MOST_COMMENTED,
    title: 'Most commented',
    isExtra: true,
  }
];
const itemFilmsListTemplate = (param) => {
  const extraClass = param.isExtra ? ' films-list--extra' : '';
  const additionalTitleClass = param.isExtra ? '' : ' visually-hidden';
  return `<section class="films-list${extraClass}" id="${param.id}">
    <h2 class="films-list__title${additionalTitleClass}">${param.title}</h2>
    <div class="films-list__container">
    </div>
  </section>`;
};

const generateFilmsList = (params) => params.map( (param) => itemFilmsListTemplate(param)).join('');

const createFilmsListTemplate = () => (
  `<section class="films">
    ${generateFilmsList(filmListParams)}
  </section>`
);

const createEmptyFilmsListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class FilmsListView {
  #element = null;

  #filmListElements = {
    [filmList.ALL_FILMS]: null,
    [filmList.TOP_RATED]: null,
    [filmList.MOST_COMMENTED]: null,
  };

  #countFilms = 0;

  constructor(countFilms = 0) {
    this.#countFilms = countFilms;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return this.#countFilms ? createFilmsListTemplate() : createEmptyFilmsListTemplate();
  }

  getFilmList(listId){
    if(!this.#filmListElements[listId]) {
      this.#filmListElements[listId] = this.element.querySelector(`#${listId} .films-list__container`);
    }
    return this.#filmListElements[listId];
  }

  get allListElement() {
    return this.getFilmList(filmList.ALL_FILMS);
  }

  get topRatedListElement() {
    return this.getFilmList(filmList.TOP_RATED);
  }

  get mostCommentedListElement() {
    return this.getFilmList(filmList.MOST_COMMENTED);
  }

  removeElement() {
    this.#element = null;
  }
}
