import FilmCardView from '../view/film-card-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import {CommentAction, FilmAction, UpdateType} from '../const';
import {isEscEvent} from '../utils/common';

export class FilmPresenter {
  #container = null;
  #changeData = null;
  #film = null;
  #filmCardComponent = null;
  #filmDetailsPopupComponent = null;
  #isPopupOpen = false;
  #siteFooterElement = document.querySelector('.footer');
  _callback = {};

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmCardComponent;
    this.#filmCardComponent = new FilmCardView(film);

    this.#filmCardComponent.setClickHandler(this.#handleCardClick);
    this.#filmCardComponent.setActionHandler(this.#handlerFilmAction);

    if(prevFilmComponent === null) {
      render(this.#container, this.#filmCardComponent);
      return;
    }

    replace(this.#filmCardComponent, prevFilmComponent);
    remove(prevFilmComponent);
  }

  openPopup = () => {
    const prevFilmDetailsPopupComponent = this.#filmDetailsPopupComponent;
    this.#filmDetailsPopupComponent = new FilmDetailsPopupView(this.#film);

    this.#filmDetailsPopupComponent.setCloseClickHandler(this.#handleClosePopup);
    this.#filmDetailsPopupComponent.setActionHandler(this.#handlerFilmAction);
    this.#filmDetailsPopupComponent.setCommentActionHandler(this.#handlerCommentAction);

    document.body.classList.add('hide-overflow');

    render(this.#siteFooterElement, this.#filmDetailsPopupComponent, RenderPosition.AFTEREND);

    if(prevFilmDetailsPopupComponent === null) {
      render(this.#siteFooterElement, this.#filmDetailsPopupComponent, RenderPosition.AFTEREND);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      return;
    }

    replace(this.#filmDetailsPopupComponent, prevFilmDetailsPopupComponent);
    remove(prevFilmDetailsPopupComponent);
  }

  removePopup() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.remove('hide-overflow');

    if(this.#filmDetailsPopupComponent !== null) {
      remove(this.#filmDetailsPopupComponent);
      this.#filmDetailsPopupComponent = null;
    }
  }

  #escKeyDownHandler = (evt) => {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.#filmDetailsPopupComponent.reset(this.#film);
      this.removePopup();
    }
  }

  setCardClick = (callback) => {
    this._callback.cardClick =  callback;
  }

  setCardClose = (callback) => {
    this._callback.cardClose =  callback;
  }

  #handleCardClick = () => {
    this._callback.cardClick();
  }

  #handleClosePopup = () => {
    this.removePopup();
    this._callback.cardClose();
  }

  #handlerFilmAction = (type) => {
    switch (type) {
      case FilmAction.ADD_WATCH_LIST:
        this.#changeData(UpdateType.MINOR, {...this.#film, isWatchList: !this.#film.isWatchList});
        break;

      case FilmAction.MARK_WATCHED:
        this.#changeData(UpdateType.MINOR, {...this.#film, isWatched: !this.#film.isWatched});
        break;

      case FilmAction.MARK_FAVORITE:
        this.#changeData(UpdateType.MINOR, {...this.#film, isFavorite: !this.#film.isFavorite});
        break;

    }
  }

  #handlerCommentAction = (type, id, newComment = null) => {
    const newFilm = {...this.#film};
    switch (type) {
      case CommentAction.ADD:
        newFilm.comments = [
          ...newFilm.comments,
          newComment
        ];
        this.#changeData(UpdateType.MINOR, newFilm);
        break;

      case CommentAction.DELETE: {
        const index = this.#film.comments.findIndex((comment) => comment.id === id);

        if (index === -1) {
          throw new Error('Can\'t delete unexisting comment');
        }
        newFilm.comments = [
          ...newFilm.comments.slice(0, index),
          ...newFilm.comments.slice(index + 1),
        ];
        this.#changeData(UpdateType.MINOR, newFilm);
        break;
      }
    }
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  }
}
