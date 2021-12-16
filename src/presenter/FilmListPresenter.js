import {SortType} from '../const.js';
import dayjs from 'dayjs';
import {render, RenderPosition, remove} from '../utils/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import {isEscEvent} from '../utils/common';
import ShowButtonView from '../view/show-button-view';
import FilmsListView from '../view/films-list-view';
import {FilmCardPresenter} from './FilmCardPresenter';
import SortView from '../view/sort-view';

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
  #currentSortType = SortType.DEFAULT;

  constructor(container) {
    this.#container = container;
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
        this.#filmList.sort((film1, film2) => dayjs(film1.releaseDate).diff(dayjs(film2.releaseDate)));
        break;
      case SortType.RATING:
        this.#filmList.sort((film1, film2) => film1.rating > film2.rating ? 1: -1);
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

    this.#sortFilmList(sortType);
    this.#clearFilmList();
    this.#renderMainFilmList();
  }

  #renderSort = () => {
    render(this.#container, this.#sortComponent);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #renderSectionFilms = () => {
    render(this.#container, this.#filmListComponent);
    this.#initFilmList();
  }

  #renderFilmCard = (container, film) => {
    const filmCardPresenter = new FilmCardPresenter(container);
    filmCardPresenter.init(film);
    this.#filmCardPresenter.set(film.id, filmCardPresenter);
  };

/*  #renderFilmList = (container, count) => {
    for (let i = 0; i < count && i < this.#filmList.length; i++) {
      this.#renderFilmCard(container, this.#filmList[i]);
    }
  };*/

  #renderFilms = (container, films, from, to) => {
    films
      .slice(from, to)
      .forEach((film) => this.#renderFilmCard(container, film));
  }

  #renderMainFilmList = (container, films) => {
    const from = 0;
    const to = Math.min(films.length, FILM_COUNT_PER_STEP);
    this.#renderFilms(container, films, from, to);

    if (this.#filmList.length > FILM_COUNT_PER_STEP) {
      this.#renderMoreButton();
    }
  }

  get filmsOrderedByTopRated() {
    return [...this.#filmList].sort((film1, film2) =>
      film1.rating < film2.rating ? 1 : -1
    );
  }

  get filmsOrderedByCommentCount() {
    return [...this.#filmList].sort((film1, film2) =>
      film1.comments.length < film2.comments.length ? 1 : -1
    );
  }

  #handleMoreButtonClick = () => {
    const from = this.#renderedFilmCount;
    const to = this.#renderedFilmCount + FILM_COUNT_PER_STEP;
    this.#renderFilms(this.#filmListComponent.allListElement, this.#filmList, from, to);
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
    let onKeyDown = null;
    let filmDetailPopupComponent = null;

    const addFilmDetailsPopup = (film) => {
      filmDetailPopupComponent = new FilmDetailsPopupView(film);
      render(this.#container, filmDetailPopupComponent);
      document.body.classList.add('hide-overflow');
    };

    const removePopup = () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('hide-overflow');

      if(filmDetailPopupComponent !== null) {
        filmDetailPopupComponent.element.remove();
        filmDetailPopupComponent = null;
      }
    };

    const onCloseFilmDetailPopup = () => removePopup(filmDetailPopupComponent);

    onKeyDown = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        removePopup();
      }
    };

    const onFilmCardClick = (film) => () => {
      addFilmDetailsPopup(film);
      filmDetailPopupComponent.setCloseClickHandler(onCloseFilmDetailPopup);
      document.addEventListener('keydown', onKeyDown);
    };

    this.#renderMainFilmList(this.#filmListComponent.allListElement, this.#filmList);
    this.#renderFilms(this.#filmListComponent.topRatedListElement, this.filmsOrderedByTopRated, 0, FILM_TOP_RATED_COUNT);
    this.#renderFilms(this.#filmListComponent.mostCommentedListElement, this.filmsOrderedByCommentCount, 0, FILM_MOST_COMMENTED_COUNT);
  };

  #clearFilmList = () => {
    this.#filmCardPresenter.forEach((presenter) => presenter.destroy());
    this.#filmCardPresenter.clear();
  }
}
