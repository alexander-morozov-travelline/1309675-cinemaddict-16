import {render} from './utils/render.js';

import ProfileView from './view/profile-view';
import StatisticView from './view/statistic-view';
import { generateFilm } from './mock/film';
import { generateComments } from './mock/comments';
import FilmListPresenter from './presenter/film-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';

const FILM_COUNT = 15;

const filmList = Array.from({length: FILM_COUNT}, generateFilm);
const comments = generateComments(filmList);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView());
render(siteStatisticsElement, new StatisticView());

const commentsModel = new CommentsModel();
commentsModel.comments = comments;

const filmsModel = new FilmsModel(commentsModel);
filmsModel.filmsList = filmList;

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

const movieListPresenter = new FilmListPresenter({
  container: siteMainElement,
  filmsModel: filmsModel,
  filterModel: filterModel,
  commentsModel: commentsModel
});

filterPresenter.init();
movieListPresenter.init();
