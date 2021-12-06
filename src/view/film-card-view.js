import {truncateText} from '../util';
import {MAX_TEXT_LENGTH_ON_CARD} from '../const';

export const createFilmCardTemplate = (film) => {
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

//@todo: начал делать, понял что пока рано, оставлю для следующей по списку задачи
/*export default class FilmCardView {
  #element = null;
  #card = null;

  constructor(card) {
    this.#card = card;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmCardTemplate(this.#card);
  }

  removeElement() {
    this.#element = null;
  }
}*/
