import {getFormattedDate} from '../utils/common';
import AbstractView from './abstract-view';
import {FilmAction} from '../const.js';

const createGenresTemplate = (genreList) => genreList.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

const createItemComment = (comment) => {
  const {
    emoji,
    text,
    author,
    day
  } = comment;
  return `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${emoji}" width="55" height="55" alt="emoji">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getFormattedDate(day, 'YYYY/MM/DD HH:mm')}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`;
};

const createCommentTemplate = (commentList) => commentList.map((comment) => createItemComment(comment)).join('');

const createFilmDetailsPopupTemplate = (film) => {
  const {
    title,
    titleOriginal,
    director,
    writers,
    actors,
    runtime,
    country,
    genres,
    description,
    rating,
    releaseDate,
    poster,
    ageRating,
    isFavorite,
    isWatched,
    isWatchList,
    comments,
  } = film;

  const activeClassName = (item) => item ? 'film-details__control-button--active' : '';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">
            <p class="film-details__age">${ageRating}+</p>
          </div>
          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${titleOriginal}</p>
              </div>
              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>
            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${releaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${createGenresTemplate(genres)}</td>
              </tr>
            </table>
            <p class="film-details__film-description">${description}</p>
          </div>
        </div>
        <section class="film-details__controls">
          <button type="button" data-action-type="${FilmAction.ADD_WATCH_LIST}"
                  class="film-details__control-button
                        film-details__control-button--watchlist
                        ${activeClassName(!isWatchList)}"
                  id="watchlist" name="watchlist">
                  Add to watchlist
          </button>
          <button type="button" data-action-type="${FilmAction.MARK_WATCHED}"
                  class="film-details__control-button
                        film-details__control-button--watched
                        ${activeClassName(isWatched)}"
                  id="watched" name="watched">
                  Already watched
          </button>
          <button type="button" data-action-type="${FilmAction.MARK_FAVORITE}"
                  class="film-details__control-button
                        film-details__control-button--favorite
                        ${activeClassName(isFavorite)}"
                  id="favorite" name="favorite">
                  Add to favorites
          </button>
        </section>
      </div>
      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
          <ul class="film-details__comments-list">
            ${createCommentTemplate(comments)}
          </ul>
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmDetailsPopupView extends AbstractView {
  #film = null;
  #closeButtonElement = null;
  #buttonWatchListElement = null;
  #buttonWatchedElement = null;
  #buttonFavoriteElement = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get template() {
    return createFilmDetailsPopupTemplate(this.#film);
  }

  get closeButtonElement() {
    if(!this.#closeButtonElement) {
      this.#closeButtonElement = this.element.querySelector('.film-details__close-btn');
    }
    return this.#closeButtonElement;
  }

  setCloseClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.closeButtonElement.addEventListener('click', this.#closeClickHandler);
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
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
