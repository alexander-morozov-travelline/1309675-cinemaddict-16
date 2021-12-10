import AbstractView from './abstract-view';

const createStatisticTemplate = () => (
  '<p>0 movies inside</p>'
);

export default class StatisticView extends AbstractView {
  get template() {
    return createStatisticTemplate();
  }
}
