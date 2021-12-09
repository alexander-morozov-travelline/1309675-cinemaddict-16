import {createElement} from '../render';

const createEmptyFilmsListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class FilmsListEmptyView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createEmptyFilmsListTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
