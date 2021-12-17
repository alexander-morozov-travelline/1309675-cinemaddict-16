import {AbstractFilmPresenter} from './AbstractFilmPresenter';
import FilmDetailsPopupView from '../view/film-details-popup-view';

export class FilmDetailsPopupPresenter extends AbstractFilmPresenter {
  initFilmComponent(film) {
    this._filmComponent = new FilmDetailsPopupView(film);
  }
}
