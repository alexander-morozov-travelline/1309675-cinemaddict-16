import he from 'he';
import {getHumanFormattedDate, getTimeOutOfMinutes} from '../utils/common';
import {CommentAction, Emoji, FilmAction} from '../const.js';
import SmartView from './smart-view';

const createGenresTemplate = (genreList) => genreList.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

const createItemComment = (comment, isDeleting, isDisabled, deletingCommentId) => {
  const {
    id,
    emoji,
    text,
    author,
    day
  } = comment;
  const emojiBlock = !emoji ? ''
    : `<span class="film-details__comment-emoji">
        <img src="${emoji}" width="55" height="55" alt="emoji">
      </span>`;

  return `<li class="film-details__comment">
      ${emojiBlock}
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${getHumanFormattedDate(day)}</span>
          <button class="film-details__comment-delete" data-comment-id="${id}" ${isDisabled ? 'disabled' : ''}>${isDeleting && id === deletingCommentId ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`;
};

const createCommentTemplate = (commentList, isDeleting, isDisabled, deletingCommentId) => commentList.length
  ? commentList.map((comment) => createItemComment(comment, isDeleting, isDisabled, deletingCommentId)).join('')
  : '';

const createCommentEmojiTemplate = (emoji) => emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : '';

const createFilmDetailsPopupTemplate = (film, comments) => {
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
    commentEmoji,
    comment,
    isDisabled,
    isSaving,
    isDeleting,
    deletingCommentId,
  } = film;

  const activeClassName = (item) => item ? 'film-details__control-button--active' : '';
  const checkedEmoji = (emoji) => commentEmoji === emoji ? 'checked="checked"' : '';

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
                <td class="film-details__cell">${getTimeOutOfMinutes(runtime)}</td>
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
                        ${activeClassName(isWatchList)}"
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
            ${createCommentTemplate(comments, isDeleting, isDisabled, deletingCommentId)}
          </ul>
          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${createCommentEmojiTemplate(commentEmoji)}</div>
            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
                ${isSaving ? 'disabled' : ''}
              >${he.encode(comment)}</textarea>
            </label>
            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${isSaving ? 'disabled' : ''} ${checkedEmoji(Emoji.SMILE)} type="radio" id="emoji-smile" value="${Emoji.SMILE}">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${isSaving ? 'disabled' : ''}  ${checkedEmoji(Emoji.SLEEPING)} type="radio" id="emoji-sleeping" value="${Emoji.SLEEPING}">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${isSaving ? 'disabled' : ''}  ${checkedEmoji(Emoji.PUKE)} type="radio" id="emoji-puke" value="${Emoji.PUKE}">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" ${isSaving ? 'disabled' : ''}  ${checkedEmoji(Emoji.ANGRY)} type="radio" id="emoji-angry" value="${Emoji.ANGRY}">
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

export default class FilmDetailsPopupView extends SmartView {
  #comments = [];
  constructor(film, comments) {
    super();
    this._data = FilmDetailsPopupView.parseFilmToData(film);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createFilmDetailsPopupTemplate(this._data, this.#comments);
  }

  get closeButtonElement() {
    return this.element.querySelector('.film-details__close-btn');
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
    this.element.querySelectorAll('.film-details__control-button').forEach((button) => {
      button.addEventListener('click', this.#actionClickHandler);
    });
  }

  #actionClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.action(evt.target.dataset.actionType);
  }

  setCommentActionHandler = (callback) => {
    this._callback.commentAction = callback;

    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => {
      button.addEventListener('click', this.#deleteCommentHandler);
    });
  }

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    const  commentId = evt.target.dataset.commentId;
    const index = this.#comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }
    this._callback.commentAction(CommentAction.DELETE, this.#comments[index], this._data.id);
  }

  addCommentHandler = () => {
    const newComment = {
      emotion: this._data.commentEmoji,
      comment: this._data.comment
    };
    this._callback.commentAction(CommentAction.ADD, newComment, this._data.id);
  }

  reset = (film) => {
    this.updateData(
      FilmDetailsPopupView.parseFilmToData(film),
    );
  }

  #setInnerHandlers = () => {
    this.element.querySelectorAll('input[name="comment-emoji"]').forEach((input) => {
      input.addEventListener('click', this.#onChangeCommentEmoji);
    });

    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  #onChangeCommentEmoji = (evt) => {
    evt.preventDefault();
    this.updateData({
      commentEmoji: evt.target.value,
    });
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value,
    }, true);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setCloseClickHandler(this._callback.closeClick);
    this.setActionHandler(this._callback.action);
    this.setCommentActionHandler(this._callback.commentAction);
  }

  static parseFilmToData = (film) => ({...film,
    comment: '',
    commentEmoji: null,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
    deletingCommentId: null,
  });
}
