import {AbstractFilmPresenter} from './AbstractFilmPresenter';
import FilmCardView from '../view/film-card-view';

export class FilmCardPresenter extends AbstractFilmPresenter {
    init = (film) => {
      super.init(film);
      this.filmComponent.setClickHandler(this.#handleCardClick);
    }

    initFilmComponent(film) {
      this._filmComponent = new FilmCardView(film);
    }

    setCardClick = (callback) => {
      this._callback.cardClick = callback;
    }

    #handleCardClick = () => {
      this._callback.cardClick(this.film);
    }
}
