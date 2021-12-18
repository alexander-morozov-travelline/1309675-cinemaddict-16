import {AbstractFilmPresenter} from './AbstractFilmPresenter';
import FilmDetailsPopupView from '../view/film-details-popup-view';
import {remove} from '../utils/render';

export class FilmDetailsPopupPresenter extends AbstractFilmPresenter {
  init = (film) => {
    super.init(film);
    this.filmComponent.setCloseClickHandler(this.#removePopup);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.add('hide-overflow');
  }

  initFilmComponent(film) {
    this._filmComponent = new FilmDetailsPopupView(film);
  }

  getOpenCardFilmId() {
    return this.film?.id;
  }

  #removePopup = () => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    document.body.classList.remove('hide-overflow');

    if(this.filmComponent !== null) {
      remove(this.filmComponent);
      this._filmComponent = null;
      this.film = null;
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#removePopup();
    }
  }
}
