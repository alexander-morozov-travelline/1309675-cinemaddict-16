import {render, RenderPosition} from './render.js';
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

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

const filmList = Array.from({length: FILM_COUNT}, generateFilm);
const filters = generateFilter(filmList);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView().element);
render(siteMainElement, new MainNavigationView(filters).element);
render(siteMainElement, new SortView().element);
render(siteMainElement, new FilmsListView().element);
render(siteStatisticsElement, new StatisticView().element);

const filmsElement = siteMainElement.querySelector('.films');
const filmListContainer = filmsElement.querySelector('#allFilms .films-list__container');
const filmListTopRatedContainer = filmsElement.querySelector('#topRated .films-list__container');
const filmListMostCommentedContainer = filmsElement.querySelector('#mostCommented .films-list__container');

const addFilmDetailsPopup = (film) => {
  const filmDetailPopupComponent = new FilmDetailsPopupView(film);
  render(siteFooterElement, filmDetailPopupComponent.element, RenderPosition.AFTEREND);
  document.body.classList.add('hide-overflow');
  return filmDetailPopupComponent;
};

const removePopup = (filmDetailPopupComponent) => {
  filmDetailPopupComponent.element.remove();
  document.body.classList.remove('hide-overflow');
};

const onCloseFilmDetailPopup = (evt, filmDetailPopupComponent) => {
  evt.preventDefault();

  filmDetailPopupComponent.closeButtonElement.removeEventListener('click', onCloseFilmDetailPopup);
  removePopup(filmDetailPopupComponent);
};

const renderFilmCard = (container, film) => {
  const filmCardComponent = new FilmCardView(film);
  render(container, filmCardComponent.element);

  filmCardComponent.cardLinkElement.addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault();
    const filmDetailPopupComponent = addFilmDetailsPopup(film);
    filmDetailPopupComponent.closeButtonElement.addEventListener('click',
      (closeEvent) => onCloseFilmDetailPopup(closeEvent, filmDetailPopupComponent)
    );
  });
};

for (let i = 0; i < FILM_COUNT_PER_STEP; i++) {
  renderFilmCard(filmListContainer, filmList[i]);
}
for (let i = 0; i < FILM_TOP_RATED_COUNT; i++) {
  renderFilmCard(filmListTopRatedContainer, filmList[i]);
}
for (let i = 0; i < FILM_MOST_COMMENTED_COUNT; i++) {
  renderFilmCard(filmListMostCommentedContainer, filmList[i]);
}


if (filmList.length > FILM_COUNT_PER_STEP) {
  let renderFilmCount = FILM_COUNT_PER_STEP;
  const showMoreComponent = new ShowButtonView();
  render(filmListContainer, showMoreComponent.element, RenderPosition.AFTEREND);

  showMoreComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();
    filmList
      .slice(renderFilmCount, renderFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        renderFilmCard(filmListContainer, film);
      });

    renderFilmCount += FILM_COUNT_PER_STEP;

    if (renderFilmCount >= filmList.length) {
      showMoreComponent.element.remove();
    }
  });
}
