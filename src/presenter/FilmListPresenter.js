import {FilmListNames, SortType} from '../const.js';
import {render, RenderPosition, remove, replace} from '../utils/render';
import {updateItem} from '../utils/common';
import ShowButtonView from '../view/show-button-view';
import FilmsListView from '../view/films-list-view';
import {FilmCardPresenter} from './FilmCardPresenter';
import SortView from '../view/sort-view';
import {sortCommentCountDown, sortRatingDown, sortReleaseDateDown} from '../utils/film';
import {FilmDetailsPopupPresenter} from './FilmDetailsPopupPresenter';

const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

export default class FilmListPresenter {
  #container = null;

  #filmListComponent = new FilmsListView();
  #sortComponent = new SortView();
  #showMoreComponent = new ShowButtonView();
  #filmList = [];

  #sourceFilmList = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmCardPresenter = new Map();
  #filmDetailsPopupPresenter = null;
  #currentSortType = SortType.DEFAULT;
  #openCardFilmId = null;

  constructor(container) {
    this.#container = container;
    this.#filmDetailsPopupPresenter = new FilmDetailsPopupPresenter(this.#container, this.#handleFilmChange);
  }

  init = (filmList) => {
    this.#filmList = [...filmList];
    this.#sourceFilmList = [...filmList];

    this.#renderSort();
    this.#renderSectionFilms();
  }

  #sortFilmList = (sortType) => {
    switch (sortType) {
      case SortType.DATE:
        this.#filmList.sort(sortReleaseDateDown);
        break;
      case SortType.RATING:
        this.#filmList.sort(sortRatingDown);
        break;
      default:
        this.#filmList = [...this.#sourceFilmList];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#reRenderSort(sortType);

    this.#sortFilmList(sortType);
    this.#clearFilmList();
    this.#initFilmList();
  }

  #reRenderSort = (sortType) =>  {
    const updatedSortComponent = new SortView(sortType);
    replace(updatedSortComponent, this.#sortComponent);
    updatedSortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    this.#sortComponent = updatedSortComponent;
  }

  #renderSort = () => {
    render(this.#container, this.#sortComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleFilmChange = (updatedFilm) => {
    this.#filmList = updateItem(this.#filmList, updatedFilm);
    this.#sourceFilmList = updateItem(this.#sourceFilmList, updatedFilm);

    this.#filmCardPresenter.get(FilmListNames.ALL_FILMS + updatedFilm.id)?.init(updatedFilm);
    this.#filmCardPresenter.get(FilmListNames.TOP_RATED + updatedFilm.id)?.init(updatedFilm);
    this.#filmCardPresenter.get(FilmListNames.MOST_COMMENTED + updatedFilm.id)?.init(updatedFilm);

    if(this.#filmDetailsPopupPresenter.getOpenCardFilmId() === updatedFilm.id) {
      this.#filmDetailsPopupPresenter.init(updatedFilm);
    }
  }

  #handleCardClick = (film) => {
    this.#filmDetailsPopupPresenter.init(film);
    this.#openCardFilmId = film.id;
  };

  #renderSectionFilms = () => {
    render(this.#container, this.#filmListComponent);
    this.#initFilmList();
  }

  #renderFilmCard = (containerId, film) => {
    const container = this.#filmListComponent.getFilmList(containerId);
    const filmCardPresenter = new FilmCardPresenter(container, this.#handleFilmChange);
    filmCardPresenter.setCardClick(this.#handleCardClick);
    filmCardPresenter.init(film);

    this.#filmCardPresenter.set(containerId + film.id, filmCardPresenter);
  };

  #renderFilms = (containerId, films, from, to) => {
    films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(containerId, film));
  }

  #renderMainFilmList = (films) => {
    const from = 0;
    const to = Math.min(films.length, FILM_COUNT_PER_STEP);

    this.#renderFilms(FilmListNames.ALL_FILMS, films, from, to);

    if (this.#filmList.length > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  get filmsOrderedByTopRated() {
    return [...this.#filmList].sort(sortRatingDown);
  }

  get filmsOrderedByCommentCount() {
    return [...this.#filmList].sort(sortCommentCountDown);
  }

  #handleMoreButtonClick = () => {
    const from = this.#renderedFilmCount;
    const to = this.#renderedFilmCount + FILM_COUNT_PER_STEP;
    this.#renderFilms(FilmListNames.ALL_FILMS, this.#filmList, from, to);
    this.#renderedFilmCount = to;

    if (this.#renderedFilmCount >= this.#filmList.length) {
      remove(this.#showMoreComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmListComponent.allListElement, this.#showMoreComponent, RenderPosition.AFTEREND);
    this.#showMoreComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #initFilmList = () => {
    this.#renderMainFilmList(this.#filmList);
    this.#renderFilms(FilmListNames.TOP_RATED, this.filmsOrderedByTopRated, 0, FILM_TOP_RATED_COUNT);
    this.#renderFilms(FilmListNames.MOST_COMMENTED, this.filmsOrderedByCommentCount, 0, FILM_MOST_COMMENTED_COUNT);
  };

  #clearFilmList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
  }
}
