import {CommentAction, ExtraTitle, FilmListNames, FilterType, SortType, UpdateType} from '../const.js';
import {render, RenderPosition, remove} from '../utils/render';
import ShowButtonView from '../view/show-button-view';
import FilmsListView from '../view/films-list-view';
import {FilmPresenter, State as FilmPresenterViewState} from './film-presenter';
import SortView from '../view/sort-view';
import {sortCommentCountDown, sortRatingDown, sortReleaseDateDown} from '../utils/film';
import {filter} from '../utils/filter';
import FilmsListEmptyView from '../view/films-list-empty-view';
import LoadingView from '../view/loading-view';
import FilmsListExtraView from '../view/films-list-extra-view';

const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

export default class FilmListPresenter {
  #container = null;
  #filmsModel = null;
  #filterModel = null;
  #commentsModel = null;

  #filmListComponent = null;
  #filmListTopRatedComponent = null;
  #filmListMostCommentedComponent = null;
  #filmsListEmptyComponent = null;
  #sortComponent = null;
  #showMoreComponent = new ShowButtonView();
  #loadingComponent = new LoadingView();

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();
  #filmPresenterWithPopup = null;
  #filmIdWithOpenPopup = null;
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #isLoading = true;

  constructor(props) {
    const {
      container,
      filmsModel,
      filterModel,
      commentsModel,
    } = props;
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
    this.#filmListComponent = new FilmsListView();
    render(this.#container, this.#filmListComponent);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleCommentEvent);

    this.#renderMainContainer({resetRenderedFilmCount: true, resetSortType: true});
  }

  destroy = () => {
    this.#clearMainContainer({resetRenderedFilmCount: true, resetSortType: true});

    remove(this.#filmListComponent);
    remove(this.#sortComponent);
    remove(this.#showMoreComponent);

    this.#filmsModel.removeObserver(this.#handleModelEvent);
    this.#commentsModel.removeObserver(this.#handleCommentEvent);
  }

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.LOADED_COMMENT:
        this.#handleLoadedComment();
        break;
      case UpdateType.MINOR:
        this.#clearMainContainer();
        this.#renderMainContainer();
        break;
      case UpdateType.MAJOR:
        this.#clearMainContainer({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderMainContainer();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderMainContainer();
        break;
    }
  }

  #handleCommentEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.LOADED_COMMENT:
        this.#handleModelEvent(UpdateType.LOADED_COMMENT, this.#filmsModel.getFilmById(data.idFilm));
        break;
    }
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

  #handleCommentChange = async (actionType, updateType, update) => {
    switch (actionType) {
      case CommentAction.DELETE:
        this.#filmPresenterWithPopup.setViewState(FilmPresenterViewState.DELETING, update.id);
        try {
          await this.#commentsModel.deleteComment(updateType, update);
        } catch (err) {
          this.#filmPresenterWithPopup.setAborting();
        }
        break;
      case CommentAction.ADD:
        this.#filmPresenterWithPopup.setSaving();
        try {
          await this.#commentsModel.addComment(updateType, update);
        } catch (err) {
          this.#filmPresenterWithPopup.setAborting();
        }
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


    const topRatedFilms = this.topRatedFilms;
    if(topRatedFilms.length){
      this.#filmListTopRatedComponent = new FilmsListExtraView(ExtraTitle.TOP_RATED);
      render(this.#filmListComponent, this.#filmListTopRatedComponent);
      this.#renderFilms({
        listComponent: this.#filmListTopRatedComponent,
        type: FilmListNames.TOP_RATED,
        filmsList: topRatedFilms,
        from: 0,
        to: FILM_TOP_RATED_COUNT
      });
    }

    const mostCommentedFilms = this.mostCommentedFilm;
    if(mostCommentedFilms.length){
      this.#filmListMostCommentedComponent = new FilmsListExtraView(ExtraTitle.MOST_COMMENTED);
      render(this.#filmListComponent, this.#filmListMostCommentedComponent);
      this.#renderFilms({
        listComponent: this.#filmListMostCommentedComponent,
        type: FilmListNames.MOST_COMMENTED,
        filmsList: mostCommentedFilms,
        from: 0,
        to: FILM_MOST_COMMENTED_COUNT
      });
    }

  }

  #renderFilmCard = (container, type, film) => {
    const filmPresenter = new FilmPresenter({
      container: container,
      changeData: this.#handleFilmChange,
      commentsModel: this.#commentsModel,
      changeComment: this.#handleCommentChange,
    });

    filmPresenter.setCardClick(() =>this.#handleCardClick(filmPresenter, film.id));
    filmPresenter.setCardClose(this.#handleCardClose);
    filmPresenter.init(film);

    this.#filmPresenter.set(type + film.id, filmPresenter);
  };

  #renderFilms = (params) => {
    const {listComponent, type, filmsList,  from, to} = {...params};
    filmsList
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(listComponent.listElement, type, film));
  }

  #renderMainFilmList = (films) => {
    const from = 0;
    const filmsCount = this.filmsList.length;
    const to = Math.min(filmsCount, this.#renderedFilmCount);

    this.#renderFilms({
      listComponent: this.#filmListComponent,
      type: FilmListNames.ALL_FILMS,
      filmsList: films,
      from: from,
      to: to
    });

    this.#renderedFilmCount = to;

    if (filmsCount > this.#renderedFilmCount) {
      this.#renderMoreButton();
    }
  }

  get filmsOrderedByTopRated() {
    return [...this.filmsList].sort(sortRatingDown);
  }

  get topRatedFilms() {
    return this.filmsOrderedByTopRated.filter((film) => film.rating > 0);
  }

  get filmsOrderedByCommentCount() {
    return [...this.filmsList].sort(sortCommentCountDown);
  }

  get mostCommentedFilm() {
    return this.filmsOrderedByCommentCount.filter((film) => film.comments.length > 0);
  }

  #handleMoreButtonClick = () => {
    const filmsCount = this.filmsList.length;
    const from = this.#renderedFilmCount;
    const to = Math.min(this.#renderedFilmCount + FILM_COUNT_PER_STEP, filmsCount);

    this.#renderFilms({
      listComponent: this.#filmListComponent,
      type: FilmListNames.ALL_FILMS,
      filmsList: this.filmsList,
      from: from,
      to: to
    });
    this.#renderedFilmCount = to;

    if (this.#renderedFilmCount >= filmsCount) {
      remove(this.#showMoreComponent);
    }
  }

  #renderMoreButton = () => {
    render(this.#filmListComponent.listElement, this.#showMoreComponent, RenderPosition.AFTEREND);
    this.#showMoreComponent.setClickHandler(this.#handleMoreButtonClick);
  }

  #renderFilmsListEmpty = () => {
    this.#filmsListEmptyComponent =  new FilmsListEmptyView(this.#filterType);
    render(this.#filmListComponent, this.#filmsListEmptyComponent, RenderPosition.BEFOREBEGIN);
  }

  #renderLoading = () => {
    render(this.#filmListComponent, this.#loadingComponent, RenderPosition.BEFOREBEGIN);
  }

  #handleLoadedComment = () => {
    this.#filmPresenterWithPopup.handleLoadedComment();
    const filmOnPopup = this.#filmsModel.getFilmById(this.#filmIdWithOpenPopup);
    this.#filmPresenterWithPopup.init(filmOnPopup);
    this.#filmPresenterWithPopup.openPopup();
  }

  #clearMainContainer = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    const filmsCount = this.filmsList.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#filmListTopRatedComponent);
    remove(this.#filmListMostCommentedComponent);
    remove(this.#sortComponent);
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
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
