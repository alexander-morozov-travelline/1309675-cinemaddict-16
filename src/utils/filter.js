import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (filmsList) => filmsList,
  [FilterType.WATCH_LIST]: (filmsList) => filmsList.filter((film) => film.isWatchList),
  [FilterType.WATCHED]: (filmsList) => filmsList.filter((film) => film.isWatched),
  [FilterType.FAVORITES]: (filmsList) => filmsList.filter((film) => film.isFavorite),
};
