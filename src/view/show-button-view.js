import {createElement} from '../render';

const createShowButtonTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowButtonView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createShowButtonTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
