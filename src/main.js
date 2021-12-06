import {renderTemplate, RenderPosition} from './render.js';
import { createFilmCardTemplate } from './view/film-card-view';
import { createFilmDetailsPopupTemplate } from './view/film-details-popup-view';
import { createFilmsListTemplate } from './view/films-list-view';
import { createMainNavigationTemplate } from './view/main-navigation-view';
import { createProfileTemplate } from './view/profile-view';
import { createShowButtonTemplate } from './view/show-button-view';
import { createSortTemplate } from './view/sort-view';
import { createStatisticTemplate } from './view/statistic-view';
import { generateFilm } from './mock/film-card';
import { generateFilter } from './mock/filter';

const FILM_COUNT = 20;
const FILM_COUNT_PER_STEP = 5;
const FILM_TOP_RATED_COUNT = 2;
const FILM_MOST_COMMENTED_COUNT = 2;

const isShowPopup = false;
const filmList = Array.from({length: FILM_COUNT}, generateFilm);
const filters = generateFilter(filmList);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createProfileTemplate());
renderTemplate(siteMainElement, createMainNavigationTemplate(filters));
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(siteMainElement, createFilmsListTemplate());
renderTemplate(siteStatisticsElement, createStatisticTemplate());

const filmsElement = siteMainElement.querySelector('.films');
const filmListContainer = filmsElement.querySelector('#allFilms .films-list__container');
const filmListTopRatedContainer = filmsElement.querySelector('#topRated .films-list__container');
const filmListMostCommentedContainer = filmsElement.querySelector('#mostCommented .films-list__container');

const addFilmDetailsPopup = (film) => {
  const popupElement = createFilmDetailsPopupTemplate(film);
  renderTemplate(siteFooterElement, popupElement, RenderPosition.AFTEREND);
  document.body.classList.add('hide-overflow');
};

const removePopup = () => {
  const filmDetailsPopupElement = document.querySelector('.film-details');
  filmDetailsPopupElement.remove();
  document.body.classList.remove('hide-overflow');
};

let filmDetailPopupCloseButton = null;

const onCloseFilmDetailPopup = (evt) => {
  evt.preventDefault();
  if(filmDetailPopupCloseButton !== null) {
    filmDetailPopupCloseButton.removeEventListener('click', onCloseFilmDetailPopup);
    filmDetailPopupCloseButton = null;
  }
  removePopup();
};

const renderFilmCard = (container, film) => {
  renderTemplate(container, createFilmCardTemplate(film));
  //@todo: Ниже сделал немного по дурацкому, выбираю просто последний добавленный элемент, как сделать по нормальному разбирается в следующих уроках
  const cardElement = container.querySelector('.film-card:last-child');
  cardElement.querySelector('.film-card__link').addEventListener('click', (clickEvent) => {
    clickEvent.preventDefault();
    addFilmDetailsPopup(film);
    filmDetailPopupCloseButton = document.querySelector('.film-details__close-btn');
    filmDetailPopupCloseButton.addEventListener('click',
      (closeEvent) => onCloseFilmDetailPopup(closeEvent)
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

  renderTemplate(filmListContainer, createShowButtonTemplate(), RenderPosition.AFTEREND);
  const showMoreElement = filmsElement.querySelector('.films-list__show-more');

  showMoreElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    filmList
      .slice(renderFilmCount, renderFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => {
        renderFilmCard(filmListContainer, film);
      });

    renderFilmCount += FILM_COUNT_PER_STEP;

    if (renderFilmCount >= filmList.length) {
      showMoreElement.remove();
    }
  });
}


if(isShowPopup) {
  renderTemplate(siteFooterElement, createFilmDetailsPopupTemplate(filmList[0]), RenderPosition.AFTEREND);
}
