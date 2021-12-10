import dayjs from 'dayjs';
import {MAX_DAYS_GAP, MIN_MONTH_IN_YEAR, MAX_MONTH_IN_YEAR, MIN_DAYS_IN_MONTH, MAX_DAYS_IN_MONTH} from '../const';
import {
  getArrayRandLength,
  getRandomArrayElement,
  getRandomBoolean,
  getRandomInteger,
  getRandomFloat,
  getTimeOutOfMinutes
} from '../utils/common';

const generateTitle = () => {
  const TITLES = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
  ];
  return getRandomArrayElement(TITLES);
};

const generateDirector = () => {
  const DIRECTORS = [
    'David Lynch',
    'Martin Scorsese',
    'Joel and Ethan Coen',
    'Steven Soderbergh',
    'Terrence Malick',
    'Abbas Kiarostami',
    'Errol Morris',
  ];
  return getRandomArrayElement(DIRECTORS);
};

const generateWriters = () => {
  const WRITERS = [
    'William Goldman',
    'Anne Wigton',
    'Heinz Herald',
    'Richard Weil',
    'George Lucas',
    'Eric Roth',
    'Chang-dong Lee',
    'Richard Linklater',
    'Lars von Trier',
    'Quentin Tarantino'
  ];
  return getArrayRandLength(WRITERS);
};

const generateActors = () => {
  const ACTORS = [
    'William Goldman',
    'Anne Wigton',
    'Heinz Herald',
    'Dan Duryea',
    'Robert De Niro',
    'Jack Nicholson',
    'Marlon Brando',
    'Denzel Washington',
    'Katharine Hepburn',
    'Humphrey Bogart',
    'Meryl Streep',
  ];
  return getArrayRandLength(ACTORS);
};

const generateReleaseDate = (year) => {
  const randMonth = getRandomInteger(MIN_MONTH_IN_YEAR, MAX_MONTH_IN_YEAR);
  const randDay = getRandomInteger(MIN_DAYS_IN_MONTH, MAX_DAYS_IN_MONTH);

  return dayjs().year(year).month(randMonth).date(randDay);
};

const generateRuntime = () => {
  const MIN_TIME_IN_MINUTES = 30;
  const MAX_TIME_IN_MINUTES = 180;
  const totalMinutes = getRandomInteger(MIN_TIME_IN_MINUTES, MAX_TIME_IN_MINUTES);
  return getTimeOutOfMinutes(totalMinutes);
};

const generateCountry = () => {
  const COUNTRIES = [
    'Russia',
    'USA',
    'Germany',
    'Australia',
    'Poland',
    'Italy',
    'Finland',
    'India',
  ];
  return getRandomArrayElement(COUNTRIES);
};

const generateGenres = () => {
  const GENRES = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Mystery',
  ];
  return getArrayRandLength(GENRES);
};

const generateDescription = () => {
  const DESCRIPTIONS = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Nunc fermentum tortor. In rutrum ac purus sit amet tempus.',
  ];
  return getRandomArrayElement(DESCRIPTIONS);
};

const generateRating = () => {
  const MIN_RATING = 0.0;
  const MAX_RATING = 10.0;
  return getRandomFloat(MIN_RATING, MAX_RATING);
};

const generateYear = () => {
  const START_YEAR = 1950;
  const END_YEAR = 2021;
  return getRandomInteger(START_YEAR, END_YEAR);
};

const generatePoster = () => {
  const POSTERS = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];
  return getRandomArrayElement(POSTERS);
};

const generateAgeRating = () => {
  const MIN_AGE = 0;
  const MAX_AGE = 18;
  return getRandomInteger(MIN_AGE, MAX_AGE);
};

const generateEmoji = () => {
  const EMOJIS = [
    './images/emoji/angry.png',
    './images/emoji/puke.png',
    './images/emoji/sleeping.png',
    './images/emoji/smile.png'
  ];
  return getRandomArrayElement(EMOJIS);
};

const generateCommentText = () => {
  const TEXTS = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?'
  ];
  return getRandomArrayElement(TEXTS);
};

const generateCommentAuthor = () => {
  const AUTHORS = [
    'Tim Macoveev',
    'John Doe',
    'Ivan Petrov',
    'Den Ivanov',
    'Kirill Sidorov',
  ];
  return getRandomArrayElement(AUTHORS);
};

const generateCommentDay = () => {
  const daysGap = getRandomInteger(-MAX_DAYS_GAP, 0);

  return dayjs().add(daysGap, 'day');
};

const generateComment = () => ({
  emoji: generateEmoji(),
  text: generateCommentText(),
  author: generateCommentAuthor(),
  day: generateCommentDay(),
});

const generateComments = () => {
  const MIN_COMMENT_COUNT = 0;
  const MAX_COMMENT_COUNT = 5;
  const commentCount = getRandomInteger(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT);
  return Array.from({length: commentCount}, generateComment);
};

export const generateFilm = () => {
  const title = generateTitle();
  const year = generateYear();
  return {
    title: title,
    titleOriginal: title,
    director: generateDirector(),
    writers: generateWriters(),
    actors: generateActors(),
    runtime: generateRuntime(),
    country: generateCountry(),
    genres: generateGenres(),
    description: generateDescription(),
    rating: generateRating(),
    year: year,
    releaseDate: generateReleaseDate(year),
    poster: generatePoster(),
    ageRating: generateAgeRating(),
    isFavorite: getRandomBoolean(),
    isWatched:  getRandomBoolean(),
    isWatchList:  getRandomBoolean(),
    comments: generateComments(),
  };
};
