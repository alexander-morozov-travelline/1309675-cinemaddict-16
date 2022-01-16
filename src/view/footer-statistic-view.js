import AbstractView from './abstract-view';

const createStatisticTemplate = (filmsCount) => (
  `<p>${filmsCount} movies inside</p>`
);

export default class FooterStatisticView extends AbstractView {
  #filmsCount = 0;
  constructor(filmsCount) {
    super();
    this.#filmsCount = filmsCount;
  }

  get template() {
    return createStatisticTemplate(this.#filmsCount);
  }
}
