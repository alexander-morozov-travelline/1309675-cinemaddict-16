import {SortType} from '../const.js';
import dayjs from 'dayjs';
import FilmCardView from '../view/film-card-view';
import {render, RenderPosition} from '../utils/render';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import {isEscEvent} from '../utils/common';
import ShowButtonView from '../view/show-button-view';
import FilmsListView from '../view/films-list-view';

const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

export default class FilmListPresenter {
    #container = null;

    #filmListComponent = new FilmsListView();

    #filmList = [];
    #sourceFilmList = [];
    #currentSortType = SortType.DEFAULT;

    constructor(container) {
      this.#container = container;
    }

    init = (filmList) => {
      this.#filmList = [...filmList];
      this.#sourceFilmList = [...filmList];

      render(this.#container, this.#filmListComponent);
      this.#initFilmList();
    }

    #sortFilmList = (sortType) => {
      switch (sortType) {
        case SortType.DATE:
          this.#filmList.sort((film1, film2) => dayjs(film1.releaseDate).diff(dayjs(film2.releaseDate)));
          break;
        case SortType.RATING:
          this.#filmList.sort((film1, film2) => film1.rating > film2.rating);
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
      this.#renderFilmList();
    }

    #renderFilmCard = (container, film) => {
      //@todo: тут будет презентер, пока оставил код из main как есть
      const filmCardComponent = new FilmCardView(film);
      render(container, filmCardComponent);
      //filmCardComponent.setClickHandler(onFilmCardClick(film));
    };

    #renderFilmList = (container, count) => {
      for (let i = 0; i < count && i < this.#filmList.length; i++) {
        this.#renderFilmCard(container, this.#filmList[i]);
      }
    };

    #initFilmList = () => {
      let onKeyDown = null;
      let filmDetailPopupComponent = null;

      const addFilmDetailsPopup = (film) => {
        filmDetailPopupComponent = new FilmDetailsPopupView(film);
        //@todo: Пока делаю так, буду добавлять попап в тотже контейнер что и фильм, посмотрю нормально ли так будет отображаться, если да то оставлю
        render(this.#container, filmDetailPopupComponent);
        //render(siteFooterElement, filmDetailPopupComponent, RenderPosition.AFTEREND);
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

      const renderFilmCard = (container, film) => {
        const filmCardComponent = new FilmCardView(film);
        render(container, filmCardComponent);
        filmCardComponent.setClickHandler(onFilmCardClick(film));
      };

      const renderFilmList = (container, count) => {
        for (let i = 0; i < count && i < this.#filmList.length; i++) {
          renderFilmCard(container, this.#filmList[i]);
        }
      };

      renderFilmList(this.#filmListComponent.allListElement, FILM_COUNT_PER_STEP);
      renderFilmList(this.#filmListComponent.topRatedListElement, FILM_TOP_RATED_COUNT);
      renderFilmList(this.#filmListComponent.mostCommentedListElement, FILM_MOST_COMMENTED_COUNT);

      if (this.#filmList.length > FILM_COUNT_PER_STEP) {
        let renderFilmCount = FILM_COUNT_PER_STEP;
        const showMoreComponent = new ShowButtonView();
        render(this.#filmListComponent.allListElement, showMoreComponent, RenderPosition.AFTEREND);

        showMoreComponent.setClickHandler(() => {
          this.#filmList
            .slice(renderFilmCount, renderFilmCount + FILM_COUNT_PER_STEP)
            .forEach((film) => {
              renderFilmCard(this.#filmListComponent.allListElement, film);
            });

          renderFilmCount += FILM_COUNT_PER_STEP;

          if (renderFilmCount >= this.#filmList.length) {
            showMoreComponent.element.remove();
          }
        });
      }
    };


    #clearFilmList = () => {
    }
}
