import {getTimeOutOfMinutes, truncateText} from '../utils/common';
import {MAX_TEXT_LENGTH_ON_CARD} from '../const';
import AbstractView from './abstract-view';
import {FilmAction} from '../const.js';

const createFilmCardTemplate = (film) => {
  const {
    title,
    runtime,
    genres,
    description,
    rating,
    year,
    poster,
    isFavorite,
    isWatched,
    isWatchList,
    comments,
  } = film;
  const activeButtonClassName = (isActive) => isActive ? 'film-card__controls-item--active' : '';
  return `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${year}</span>
          <span class="film-card__duration">${getTimeOutOfMinutes(runtime)}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${truncateText(description, MAX_TEXT_LENGTH_ON_CARD)}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeButtonClassName(isWatchList)}"
              data-action-type="${FilmAction.ADD_WATCH_LIST}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeButtonClassName(isWatched)}"
              data-action-type="${FilmAction.MARK_WATCHED}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${activeButtonClassName(isFavorite)}"
              data-action-type="${FilmAction.MARK_FAVORITE}" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

export default class FilmCardView extends AbstractView{
  #film = null;
  #cardLinkElement = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmCardTemplate(this.#film);
  }

  get cardLinkElement() {
    if(!this.#cardLinkElement) {
      this.#cardLinkElement = this.element.querySelector('.film-card__link');
    }
    return this.#cardLinkElement;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.cardLinkElement.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  setActionHandler = (callback) => {
    this._callback.action = callback;
    this.element.querySelectorAll('button').forEach((button) => {
      button.addEventListener('click', this.#actionClickHandler);
    });
  }

  #actionClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.action(evt.target.dataset.actionType);
  }
}
