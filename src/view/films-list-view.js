import {createElement} from '../render';

const filmListNames = {
  ALL_FILMS: 'allFilms',
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};

const filmListParams = [
  {
    id: filmListNames.ALL_FILMS,
    title: 'All movies. Upcoming',
    isExtra: false,
  },
  {
    id: filmListNames.TOP_RATED,
    title: 'Top rated',
    isExtra: true,
  },
  {
    id: filmListNames.MOST_COMMENTED,
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

export default class FilmsListView {
  #element = null;

  #filmListElements = {
    [filmListNames.ALL_FILMS]: null,
    [filmListNames.TOP_RATED]: null,
    [filmListNames.MOST_COMMENTED]: null,
  };

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createFilmsListTemplate();
  }

  getFilmList(listId){
    if(!this.#filmListElements[listId]) {
      this.#filmListElements[listId] = this.element.querySelector(`#${listId} .films-list__container`);
    }
    return this.#filmListElements[listId];
  }

  get allListElement() {
    return this.getFilmList(filmListNames.ALL_FILMS);
  }

  get topRatedListElement() {
    return this.getFilmList(filmListNames.TOP_RATED);
  }

  get mostCommentedListElement() {
    return this.getFilmList(filmListNames.MOST_COMMENTED);
  }

  removeElement() {
    this.#element = null;
  }
}
