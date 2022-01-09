import AbstractView from './abstract-view';
import {FilterType} from '../const.js';

const emptyFilmsListText = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCH_LIST]: 'There are no movies to watch now',
  [FilterType.WATCHED]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createEmptyFilmsListTemplate = (filterType) => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">${emptyFilmsListText[filterType]}</h2>
    </section>
  </section>`
);

export default class FilmsListEmptyView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createEmptyFilmsListTemplate(this._data);
  }
}
