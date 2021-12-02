import {renderTemplate, RenderPosition} from './render.js';
import { createFilmCardTemplate } from './view/film-card-view';
import { createFilmDetailsPopupTemplate } from './view/film-details-popup-view';
import { createFilmsListTemplate } from './view/films-list-view';
import { createMainNavigationTemplate } from './view/main-navigation-view';
import { createProfileTemplate } from './view/profile-view';
import { createShowButtonTemplate } from './view/show-button-view';
import { createSortTemplate } from './view/sort-view';
import { createStatisticTemplate } from './view/statistic-view';

const FILM_COUNT = 5;
const isShowPopup = false;

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

renderTemplate(siteHeaderElement, createProfileTemplate());
renderTemplate(siteMainElement, createMainNavigationTemplate());
renderTemplate(siteMainElement, createSortTemplate());
renderTemplate(siteMainElement, createFilmsListTemplate());
renderTemplate(siteStatisticsElement, createStatisticTemplate());


const filmList = siteMainElement.querySelector('.films-list__container');

for (let i = 0; i < FILM_COUNT; i++) {
  renderTemplate(filmList, createFilmCardTemplate());
}

renderTemplate(filmList, createShowButtonTemplate(), RenderPosition.AFTEREND);

if(isShowPopup) {
  renderTemplate(siteFooterElement, createFilmDetailsPopupTemplate(), RenderPosition.AFTEREND);
}
