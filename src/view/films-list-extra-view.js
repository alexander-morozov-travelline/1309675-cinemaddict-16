import AbstractView from './abstract-view';

const createFilmsListTemplate = (title) => (
  `<section class="films-list  films-list--extra">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container">
    </div>
  </section>`
);

export default class FilmsListExtraView extends AbstractView {
  #title = null;
  #list = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  get template() {
    return createFilmsListTemplate(this.#title);
  }

  get listElement() {
    if(!this.#list) {
      this.#list = this.element.querySelector('.films-list__container');
    }
    return this.#list;
  }
}
