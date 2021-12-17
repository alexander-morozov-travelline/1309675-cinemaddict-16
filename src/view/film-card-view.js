import {truncateText} from '../utils/common';
import {MAX_TEXT_LENGTH_ON_CARD} from '../const';
import AbstractView from './abstract-view';

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
          <span class="film-card__duration">${runtime}</span>
          <span class="film-card__genre">${genres[0]}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${truncateText(description, MAX_TEXT_LENGTH_ON_CARD)}</p>
        <span class="film-card__comments">${comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${activeButtonClassName(!isWatchList)}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${activeButtonClassName(isWatched)}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${activeButtonClassName(isFavorite)}" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

export default class FilmCardView extends AbstractView{
  #film = null;
  #cardLinkElement = null;
  #cardWatchListElement = null;
  #cardWatchedElement = null;
  #cardFavoriteElement = null;

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

  get cardWatchListElement() {
    if(!this.#cardWatchListElement) {
      this.#cardWatchListElement = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    }
    return this.#cardWatchListElement;
  }

  get cardWatchedElement() {
    if(!this.#cardWatchedElement) {
      this.#cardWatchedElement = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    }
    return this.#cardWatchedElement;
  }

  get cardFavoriteElement() {
    if(!this.#cardFavoriteElement) {
      this.#cardFavoriteElement = this.element.querySelector('.film-card__controls-item--favorite');
    }
    return this.#cardFavoriteElement;
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.cardLinkElement.addEventListener('click', this.#clickHandler);
  }

  setWatchListHandler = (callback) => {
    this._callback.watchListClick = callback;
    this.cardWatchListElement.addEventListener('click', this.#watchListClickHandler);
  }

  setWatchedHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.cardWatchedElement.addEventListener('click', this.#watchedClickHandler);
  }

  setFavoriteHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.cardFavoriteElement.addEventListener('click', this.#favoriteClickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }

  #watchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchListClick();
  }

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
