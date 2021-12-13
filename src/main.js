import {render, RenderPosition} from './utils/render.js';
import FilmCardView from './view/film-card-view';
import FilmDetailsPopupView from './view/film-details-popup-view';
import FilmsListView from './view/films-list-view';
import MainNavigationView from './view/main-navigation-view';
import ProfileView from './view/profile-view';
import ShowButtonView from './view/show-button-view';
import SortView from './view/sort-view';
import StatisticView from './view/statistic-view';
import { generateFilm } from './mock/film-card';
import { generateFilter } from './mock/filter';
import { isEscEvent } from './utils/common';
import FilmsListEmptyView from './view/films-list-empty-view';

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

const filmList = Array.from({length: FILM_COUNT}, generateFilm);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

const filmListComponent = new FilmsListView();

render(siteHeaderElement, new ProfileView());
render(siteMainElement, new SortView());
render(siteStatisticsElement, new StatisticView());

const initFilmList = () => {
  let onKeyDown = null;
  let filmDetailPopupComponent = null;

  const addFilmDetailsPopup = (film) => {
    filmDetailPopupComponent = new FilmDetailsPopupView(film);
    render(siteFooterElement, filmDetailPopupComponent, RenderPosition.AFTEREND);
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
    for (let i = 0; i < count && i < filmList.length; i++) {
      renderFilmCard(container, filmList[i]);
    }
  };

  renderFilmList(filmListComponent.allListElement, FILM_COUNT_PER_STEP);
  renderFilmList(filmListComponent.topRatedListElement, FILM_TOP_RATED_COUNT);
  renderFilmList(filmListComponent.mostCommentedListElement, FILM_MOST_COMMENTED_COUNT);

  if (filmList.length > FILM_COUNT_PER_STEP) {
    let renderFilmCount = FILM_COUNT_PER_STEP;
    const showMoreComponent = new ShowButtonView();
    render(filmListComponent.allListElement, showMoreComponent, RenderPosition.AFTEREND);

    showMoreComponent.setClickHandler(() => {
      filmList
        .slice(renderFilmCount, renderFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => {
          renderFilmCard(filmListComponent.allListElement, film);
        });

      renderFilmCount += FILM_COUNT_PER_STEP;

      if (renderFilmCount >= filmList.length) {
        showMoreComponent.element.remove();
      }
    });
  }
};

if(filmList !== 'undefined' && filmList.length) {
  const filters = generateFilter(filmList);
  render(siteMainElement, new MainNavigationView(filters));
  render(siteMainElement, filmListComponent);
  initFilmList();
} else {
  render(siteMainElement, new FilmsListEmptyView());
}
