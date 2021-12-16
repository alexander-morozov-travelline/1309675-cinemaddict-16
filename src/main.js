import {render} from './utils/render.js';

import MainNavigationView from './view/main-navigation-view';
import ProfileView from './view/profile-view';
import StatisticView from './view/statistic-view';
import { generateFilm } from './mock/film';
import { generateFilter } from './mock/filter';
import FilmsListEmptyView from './view/films-list-empty-view';
import FilmListPresenter from './presenter/FilmListPresenter';

const FILM_COUNT = 20;

const filmList = Array.from({length: FILM_COUNT}, generateFilm);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView());
render(siteStatisticsElement, new StatisticView());


if(filmList !== 'undefined' && filmList.length) {
  const filters = generateFilter(filmList);
  render(siteMainElement, new MainNavigationView(filters));

  const movieListPresenter = new FilmListPresenter(siteMainElement);
  movieListPresenter.init(filmList);

} else {
  render(siteMainElement, new FilmsListEmptyView());
}
