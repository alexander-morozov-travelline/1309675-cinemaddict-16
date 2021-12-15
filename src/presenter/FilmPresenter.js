export class FilmCardPresenter {
    #container = null;
    #changeData = null;

    #film = null;

    constructor(container) {
      this.#container = container;
    }

    init= (film) => {
      this.#film = film;
    }

    #handleWatchListClick = () => {
      this.#changeData({...this.#film, isWatchList: !this.#film.isWatchList});
    }

    #handleWatchedClick = () => {
      this.#changeData({...this.#film, isWatched: !this.#film.isWatched});
    }
}
