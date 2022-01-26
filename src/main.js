import {render, remove} from './utils/render.js';

import ProfileView from './view/profile-view';
import FooterStatisticView from './view/footer-statistic-view';
import StatisticsView from './view/statistics-view';
import FilmListPresenter from './presenter/film-list-presenter';
import FilterPresenter from './presenter/filter-presenter';
import FilmsModel from './model/films-model';
import FilterModel from './model/filter-model';
import CommentsModel from './model/comments-model';
import { MenuItem } from './const';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic asdfGsdf73avvvttt';
const END_POINT = 'https://16.ecmascript.pages.academy/cinemaddict';

const apiService = new ApiService(END_POINT, AUTHORIZATION);

const commentsModel = new CommentsModel(apiService);
const filmsModel = new FilmsModel(apiService, commentsModel);


const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer');
const siteFooterStatisticsElement = siteFooterElement.querySelector('.footer__statistics');

render(siteHeaderElement, new ProfileView());
render(siteFooterStatisticsElement, new FooterStatisticView(filmsModel.filmsList.length));

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

const filmListPresenter = new FilmListPresenter({
  container: siteMainElement,
  filmsModel: filmsModel,
  filterModel: filterModel,
  commentsModel: commentsModel
});

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.FILMS:
      remove(statisticsComponent);
      filmListPresenter.init();
      break;
    case MenuItem.STATISTICS:
      filmListPresenter.destroy();
      statisticsComponent = new StatisticsView(filmsModel.watchedFilmsList);
      render(siteMainElement, statisticsComponent);
      break;
  }
};

filmListPresenter.init();

filmsModel.init().finally(() => {
  filterPresenter.setMenuClickHandler(handleSiteMenuClick);
  filterPresenter.init();
});
