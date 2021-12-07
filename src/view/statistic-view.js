import {createElement} from '../render';

const createStatisticTemplate = () => (
  '<p>0 movies inside</p>'
);

export default class StatisticView {
  #element = null;

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createStatisticTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
