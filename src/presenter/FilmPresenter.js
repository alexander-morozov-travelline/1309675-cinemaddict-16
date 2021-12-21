import FilmCardView from '../view/film-card-view';
import {remove, render, RenderPosition, replace} from '../utils/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import {FilmAtionType} from '../const';

export class FilmPresenter {
  #container = null;
  #changeData = null;
  #film = null;
  #filmCardComponent = null;
  #filmDetailsPopupComponent = null;
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

    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');

    render(this.#siteFooterElement, this.#filmDetailsPopupComponent, RenderPosition.AFTEREND);

    if(prevFilmDetailsPopupComponent === null) {
      render(this.#siteFooterElement, this.#filmDetailsPopupComponent, RenderPosition.AFTEREND);
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
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
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
      case FilmAtionType.ADD_WATCH_LIST:
        this.#changeData({...this.#film, isWatchList: !this.#film.isWatchList});
        break;

      case FilmAtionType.MARK_WATCHED:
        this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
        break;

      case FilmAtionType.MARK_FAVORITE:
        this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
        break;

    }
  }

  destroy = () => {
    remove(this.#filmCardComponent);
  }
}
