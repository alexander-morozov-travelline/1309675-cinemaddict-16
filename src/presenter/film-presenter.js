import FilmCardView from '../view/film-card-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import {FilmAction, UpdateType} from '../const';
import {isCtrlEnterEvent, isEscEvent} from '../utils/common';

export class FilmPresenter {
  #container = null;
  #changeData = null;
  #changeComment = null;
  #film = null;
  #filmCardComponent = null;
  #filmDetailsPopupComponent = null;
  #siteFooterElement = document.querySelector('.footer');
  #commentsModel;

  _callback = {};

  constructor(container, changeData, commentsModel, changeComment) {
    this.#container = container;
    this.#changeData = changeData;
    this.#commentsModel = commentsModel;
    this.#changeComment = changeComment;
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
    const filmComments = this.#commentsModel.getCommentsByFilmId(this.#film.id);
    this.#filmDetailsPopupComponent = new FilmDetailsPopupView(this.#film, filmComments);

    this.#filmDetailsPopupComponent.setCloseClickHandler(this.#handleClosePopup);
    this.#filmDetailsPopupComponent.setActionHandler(this.#handlerFilmAction);
    this.#filmDetailsPopupComponent.setCommentActionHandler(this.#handlerCommentAction);

    document.body.classList.add('hide-overflow');

    render(this.#siteFooterElement, this.#filmDetailsPopupComponent, RenderPosition.AFTEREND);

    if(prevFilmDetailsPopupComponent === null) {
      render(this.#siteFooterElement, this.#filmDetailsPopupComponent, RenderPosition.AFTEREND);
      document.addEventListener('keydown', this.#escKeyDownHandler);
      document.addEventListener('keydown', this.#ctrEnterDownHandler);
      return;
    }

    replace(this.#filmDetailsPopupComponent, prevFilmDetailsPopupComponent);
    this.#filmDetailsPopupComponent.setScroll(prevFilmDetailsPopupComponent.scrollOptions);

    remove(prevFilmDetailsPopupComponent);
  }

  removePopup() {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.removeEventListener('keydown', this.#ctrEnterDownHandler);
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

  #ctrEnterDownHandler = (evt) => {
    if(isCtrlEnterEvent(evt)) {
      evt.preventDefault(evt);
      this.#filmDetailsPopupComponent.addCommentHandler();
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

  #handlerCommentAction = (type, comment ) => {
    this.#changeComment(type, UpdateType.MINOR, comment);
  }

  destroy = () => {
    if(this.#filmDetailsPopupComponent){
      this.#filmDetailsPopupComponent.saveScroll();
    }
    remove(this.#filmCardComponent);
  }
}
