import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../const';
import {getRandomBoolean} from '../utils/common';

export default class FilmsModel extends AbstractObservable{
  #filmsList = [];
  #commentsModel = null;
  #apiService

  constructor(apiService, commentsModel) {
    super();
    this.#apiService = apiService;
    this.#commentsModel = commentsModel;
  }

  set filmsList(filmsList) {
    this.#filmsList = [...filmsList];
  }

  get filmsList() {
    return this.#filmsList;
  }

  init = async () => {
    try {
      const filmsList = await this.#apiService.filmsList;
      this.#filmsList = filmsList.map(this.#adaptToClient);
    } catch(err) {
      this.#filmsList = [];
    }

    this._notify(UpdateType.INIT);
  }

  get watchedFilmsList() {
    return this.#filmsList.filter((film) => film.isWatched);
  }

  getFilmById = (idFilm) => {
    const index = this.#filmsList.findIndex((film) => film.id === idFilm);

    if (index === -1) {
      throw new Error('Can\'t get unexisting film');
    }

    return this.filmsList[index];
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

  reloadComments = (filmId) => {
    const index = this.#filmsList.findIndex((item) => item.id === filmId);

    if (index === -1) {
      throw new Error('Can\'t reload comment unexisting film');
    }

    const film = this.#filmsList[index];
    this.#filmsList[index] = {...film, comments: this.#commentsModel.getCommentIdsByFilmId(film.id)};
  }

  #adaptToClient = (film) => {
    console.log(film);

    const adaptedFilm = {...film,
      releaseDate: film.film_info?.release?.date ? new Date(film.film_info.release.date) : null,
      title: film.film_info.title,
/*      titleOriginal: title,
      director: generateDirector(),
      writers: generateWriters(),
      actors: generateActors(),
      runtime: generateRuntime(),
      country: generateCountry(),
      genres: generateGenres(),
      description: generateDescription(),
      rating: generateRating(),
      year: year,
      releaseDate: generateReleaseDate(year),
      poster: generatePoster(),
      ageRating: generateAgeRating(),
      isFavorite: getRandomBoolean(),
      isWatched:  isWatched,
      isWatchList:  getRandomBoolean(),
      watchingDate:  generateWatchingDate(isWatched),
      comments: generateComments(),
      isArchive: film['is_archived'],
      isFavorite: film['is_favorite'],
      repeating: film['repeating_days'],*/
    };
    console.log(adaptedFilm);

    delete adaptedFilm['film_info'];

    return adaptedFilm;
  }
}
