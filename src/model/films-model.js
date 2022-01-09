import AbstractObservable from '../utils/abstract-observable';

export default class FilmsModel extends AbstractObservable{
  #filmsList = [];

  set filmsList(filmsList) {
    this.#filmsList = [...filmsList];
  }

  get filmsList() {
    return this.#filmsList;
  }

  updateFilm = (updateType, update) => {
    const index = this.#filmsList.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#filmsList = [
      ...this.#filmsList.slice(0, index),
      update,
      ...this.#filmsList.slice(index + 1),
    ];

    this._notify(updateType, update);
  }
}
