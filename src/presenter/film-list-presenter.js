import {CommentAction, FilmListNames, FilterType, SortType, UpdateType} from '../const.js';
import {render, RenderPosition, remove} from '../utils/render';
import ShowButtonView from '../view/show-button-view';
import FilmsListView from '../view/films-list-view';
import {FilmPresenter} from './film-presenter';
import SortView from '../view/sort-view';
import {sortCommentCountDown, sortRatingDown, sortReleaseDateDown} from '../utils/film';
import {filter} from '../utils/filter';
import FilmsListEmptyView from '../view/films-list-empty-view';

const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

export default class FilmListPresenter {
  #container = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmListComponent = new FilmsListView();
  #filmsListEmptyComponent = null;
  #sortComponent = null;
  #showMoreComponent = new ShowButtonView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmPresenterWithPopup = null;
  #filmIdWithOpenPopup = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;

  constructor(container, filmsModel, filterModel, commentsModel) {
    this.#container = container;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
    this.#commentsModel = commentsModel;
  }

  get filmsList() {
    this.#filterType = this.#filterModel.filter;
    const filmsList = this.#filmsModel.filmsList;
    const filteredFilmsList = filter[this.#filterType](filmsList);

    switch (this.#currentSortType) {
      case SortType.DATE:
        return filteredFilmsList.sort(sortReleaseDateDown);
      case SortType.RATING:
        return filteredFilmsList.sort(sortRatingDown);
    }

    return filteredFilmsList;
  }

  init = () => {
    render(this.#container, this.#filmListComponent);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentEvent);

    this.#renderMainContainer();
  }

  destroy = () => {
    this.#clearMainContainer({resetRenderedFilmCount: true, resetSortType: true});

    remove(this.#filmListComponent);
    remove(this.#sortComponent);
    remove(this.#showMoreComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleCommentEvent);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearMainContainer();
        this.#renderMainContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearMainContainer({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderMainContainer();
        break;
    }
  }

  #handleCommentEvent = (updateType, data) => {
    this.#filmsModel.reloadComments(data.idFilm);
    this.#handleModelEvent(updateType, this.#filmsModel.getFilmById(data.idFilm));
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearMainContainer({resetRenderedFilmCount: true});
    this.#renderMainContainer();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#filmListComponent, this.#sortComponent, RenderPosition.BEFOREBEGIN);
  }

  #handleFilmChange = (updateType, updatedFilm) => {
    this.#filmsModel.updateFilm(updateType, updatedFilm);
  }

  #handleCommentChange = (actionType, updateType, update) => {
    switch (actionType) {
      case CommentAction.DELETE:
        this.#commentsModel.deleteComment(updateType, update);
        break;
      case CommentAction.ADD:
        this.#commentsModel.addComment(updateType, update);
        break;
    }
  }

  #handleCardClick = (filmPresenter, filmId) => {
    this.#filmIdWithOpenPopup = filmId;
    if(this.#filmPresenterWithPopup) {
      this.#filmPresenterWithPopup.removePopup();
    }
    filmPresenter.openPopup();
    this.#filmPresenterWithPopup = filmPresenter;
  };

  #handleCardClose = () => {
    this.#filmPresenterWithPopup = null;
    this.#filmIdWithOpenPopup = null;
  }

  #renderSectionFilms = () => {
    this.#renderMainFilmList(this.filmsList);
    this.#renderFilms(FilmListNames.TOP_RATED, this.filmsOrderedByTopRated, 0, FILM_TOP_RATED_COUNT);
    this.#renderFilms(FilmListNames.MOST_COMMENTED, this.filmsOrderedByCommentCount, 0, FILM_MOST_COMMENTED_COUNT);
  }

  #renderFilmCard = (containerId, film) => {
    const container = this.#filmListComponent.getFilmList(containerId);
    const filmPresenter = new FilmPresenter(container, this.#handleFilmChange, this.#commentsModel, this.#handleCommentChange);
    filmPresenter.setCardClick(() =>this.#handleCardClick(filmPresenter, film.id));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);

    this.#filmPresenter.set(containerId + film.id, filmPresenter);
  };

  #renderFilms = (containerId, films, from, to) => {
    films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(containerId, film));
  }

  #renderMainFilmList = (films) => {
    const from = 0;
    const filmsCount = this.filmsList.length;
    const to = Math.min(filmsCount, this.#renderedFilmCount);

    this.#renderFilms(FilmListNames.ALL_FILMS, films, from, to);
    this.#renderedFilmCount = to;

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderMoreButton();
    }
  }

  get filmsOrderedByTopRated() {
    return [...this.filmsList].sort(sortRatingDown);
  }

  get filmsOrderedByCommentCount() {
    return [...this.filmsList].sort(sortCommentCountDown);
  }

  #handleMoreButtonClick = () => {
    const filmsCount = this.filmsList.length;
    const from = this.#renderedFilmCount;
    const to = Math.min(this.#renderedFilmCount + FILM_COUNT_PER_STEP, filmsCount);

    this.#renderFilms(FilmListNames.ALL_FILMS, this.filmsList, from, to);
    this.#renderedFilmCount = to;

    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#showMoreComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmListComponent.allListElement, this.#showMoreComponent, RenderPosition.AFTEREND);
    this.#showMoreComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #renderFilmsListEmpty = () => {
    this.#filmsListEmptyComponent =  new FilmsListEmptyView(this.#filterType);
    render(this.#filmListComponent, this.#filmsListEmptyComponent, RenderPosition.BEFOREBEGIN);
  }

  #clearMainContainer = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.filmsList.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#showMoreComponent);

    if(this.#filmsListEmptyComponent) {
      remove(this.#filmsListEmptyComponent);
    }

    if(this.#filmPresenterWithPopup) {
      this.#filmPresenterWithPopup.destroy();
    }

    this.#renderedFilmCount = resetRenderedFilmCount ? FILM_COUNT_PER_STEP : Math.min(filmsCount, this.#renderedFilmCount);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderMainContainer = () => {
    const filmsCount = this.filmsList.length;

    if (filmsCount === 0) {
      this.#renderFilmsListEmpty();
      return;
    }

    if(this.#filmPresenterWithPopup && this.#filmIdWithOpenPopup) {
      const filmOnPopup = this.#filmsModel.getFilmById(this.#filmIdWithOpenPopup);
      this.#filmPresenterWithPopup.init(filmOnPopup);
      this.#filmPresenterWithPopup.openPopup();
    }

    this.#renderSort();
    this.#renderSectionFilms();
  }
}
