import AbstractView from './abstract-view';
import {SortType} from '../const.js';

const createSortTemplate = (currentSortType) => {
  const activeClassName = (isActive) => isActive ? 'sort__button--active' : '';
  return `<ul class="sort">
      <li><a href="#" class="sort__button ${activeClassName(currentSortType === SortType.DEFAULT)}"
        data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${activeClassName(currentSortType === SortType.DATE)}"
        data-sort-type="${SortType.DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${activeClassName(currentSortType === SortType.RATING)}"
        data-sort-type="${SortType.RATING}">Sort by rating</a></li>
   </ul>`;
};

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType = null) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
