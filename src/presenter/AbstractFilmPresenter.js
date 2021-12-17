import {remove, render} from '../utils/render';

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
    this.initFilmComponent(film);
    this.filmComponent.setWatchListHandler(this.#handleWatchListClick);
    this.filmComponent.setWatchedHandler(this.#handleWatchedClick);
    this.filmComponent.setFavoriteHandler(this.#handleFavoriteClick);
/*console.log(film);
console.log(this.#container);
console.log(this._filmComponent);*/
    render(this.#container, this._filmComponent);
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
