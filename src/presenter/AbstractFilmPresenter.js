import {remove, render, replace} from '../utils/render';

export class AbstractFilmPresenter {
  #container = null;
  #changeData = null;
  #film = null;
  _filmComponent = null;
  _callback = {};

  constructor(container, changeData) {
    this.#container = container;
    this.#changeData = changeData;
  }

  init(film) {
    this.#film = film;

    const prevFilmComponent = this.filmComponent;

    this.initFilmComponent(film);
    this.filmComponent.setWatchListHandler(this.#handleWatchListClick);
    this.filmComponent.setWatchedHandler(this.#handleWatchedClick);
    this.filmComponent.setFavoriteHandler(this.#handleFavoriteClick);

    if(prevFilmComponent === null) {
      render(this.#container, this._filmComponent);
      return;
    }

    replace(this._filmComponent, prevFilmComponent);
    remove(prevFilmComponent);
  }

  get filmComponent() {
    return this._filmComponent;
  }

  initFilmComponent() {
    throw new Error('Abstract method not implemented: initFilmComponent');
  }

  get film() {
    return this.#film;
  }

  set film(film) {
    this.#film = film;
  }

  destroy = () => {
    remove(this._filmComponent);
  }

  #handleWatchListClick = () => {
    this.#changeData({...this.#film, isWatchList: !this.#film.isWatchList});
  }

  #handleWatchedClick = () => {
    this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
  }

  #handleFavoriteClick = () => {
    this.#changeData({...this.#film, isFavorite: !this.#film.isFavorite});
  }
}
