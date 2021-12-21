import AbstractView from './abstract-view';
import {FilmListNames} from '../const';

const filmListParams = [
  {
    id: FilmListNames.ALL_FILMS,
    title: 'All movies. Upcoming',
    isExtra: false,
  },
  {
    id: FilmListNames.TOP_RATED,
    title: 'Top rated',
    isExtra: true,
  },
  {
    id: FilmListNames.MOST_COMMENTED,
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

export default class FilmsListView extends AbstractView {
  #filmListElements = {
    [FilmListNames.ALL_FILMS]: null,
    [FilmListNames.TOP_RATED]: null,
    [FilmListNames.MOST_COMMENTED]: null,
  };

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
    return this.getFilmList(FilmListNames.ALL_FILMS);
  }

  get topRatedListElement() {
    return this.getFilmList(FilmListNames.TOP_RATED);
  }

  get mostCommentedListElement() {
    return this.getFilmList(FilmListNames.MOST_COMMENTED);
  }

}
