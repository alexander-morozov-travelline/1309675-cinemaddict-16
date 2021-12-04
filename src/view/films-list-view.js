const filmListParams = [
  {
    id: 'allFilms',
    title: 'All movies. Upcoming',
    isExtra: false,
  },
  {
    id: 'topRated',
    title: 'Top rated',
    isExtra: true,
  },
  {
    id: 'mostCommented',
    title: 'Most commented',
    isExtra: true,
  }
];
const itemFilmsListTemplate = (param) => {
  const extraClass = param.isExtra ? ' films-list--extra' : '';
  const additionalTitleClass = param.isExtra ? '' : ' visually-hidden';
  return `<section class="films-list${extraClass}" id="${param.id}">
    <h2 class="films-list__title${additionalTitleClass}">${param.title}</h2>
    <div class="films-list__container">
    </div>
  </section>`;
};

const generateFilmsList = (params) => params.map( (param) => itemFilmsListTemplate(param)).join('');

export const createFilmsListTemplate = () => (
  `<section class="films">
    ${generateFilmsList(filmListParams)}
  </section>`
);
