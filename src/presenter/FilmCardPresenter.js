import FilmCardView from '../view/film-card-view';
import {remove, render} from '../utils/render';

export class FilmCardPresenter {
    #container = null;
    #changeData = null;
    #filmCardComponent = null;

    #film = null;

    constructor(container, changeData) {
      this.#container = container;
      this.#changeData = changeData;
    }

    init = (film) => {
      this.#film = film;

      this.#filmCardComponent = new FilmCardView(film);
      this.#filmCardComponent.setClickHandler(this.#handleClick);
      this.#filmCardComponent.setWatchListHandler(this.#handleWatchListClick);
      this.#filmCardComponent.setWatchedHandler(this.#handleWatchedClick);
      this.#filmCardComponent.setFavoriteHandler(this.#handleFavoriteClick);
      render(this.#container, this.#filmCardComponent);
    }

    destroy = () => {
      remove(this.#filmCardComponent);
    }

    #handleClick = () => {

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
