import AbstractView from './abstract-view';

const createFilmsListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>
    </section>
  </section>`
);

export default class FilmsListView extends AbstractView {
  #list = null;

  get template() {
    return createFilmsListTemplate();
  }

  get listElement() {
    if(!this.#list) {
      this.#list = this.element.querySelector('.films-list__container');
    }
    return this.#list;
  }
}
