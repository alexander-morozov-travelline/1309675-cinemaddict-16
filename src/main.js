import {render} from './utils/render.js';

import ProfileView from './view/profile-view';
import StatisticView from './view/statistic-view';
import { generateFilm } from './mock/film';
import FilmListPresenter from './presenter/film-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model.js';

const FILM_COUNT = 15;

const filmList = Array.from({length: FILM_COUNT}, generateFilm);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView());
render(siteStatisticsElement, new StatisticView());

const filmsModel = new FilmsModel();
filmsModel.filmsList = filmList;

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const movieListPresenter = new FilmListPresenter(siteMainElement, filmsModel, filterModel);

filterPresenter.init();
movieListPresenter.init();
