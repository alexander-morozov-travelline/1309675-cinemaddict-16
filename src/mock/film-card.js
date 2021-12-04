import dayjs from 'dayjs';
import {
  getArrayRandLength,
  getRandomArrayElement,
  getRandomBoolean,
  getRandomInteger,
  getRandomFloat,
  getTimeOutOfMinutes
} from '../util';

const generateTitle = () => {
  const titles = [
    'The Dance of Life',
    'Sagebrush Trail',
    'The Man with the Golden Arm',
    'Santa Claus Conquers the Martians',
    'Popeye the Sailor Meets Sindbad the Sailor',
  ];
  return getRandomArrayElement(titles);
};

const generateDirector = () => {
  const directors = [
    'David Lynch',
    'Martin Scorsese',
    'Joel and Ethan Coen',
    'Steven Soderbergh',
    'Terrence Malick',
    'Abbas Kiarostami',
    'Errol Morris',
  ];
  return getRandomArrayElement(directors);
};

const generateWriters = () => {
  const writers = [
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
  return getArrayRandLength(writers);
};

const generateActors = () => {
  const actors = [
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
  return getArrayRandLength(actors);
};

const generateReleaseDate = (year) => {
  const randMonth = getRandomInteger(0, 11);
  const randDay = getRandomInteger(1, 31);

  return dayjs().year(year).month(randMonth).date(randDay);
};

const generateRuntime = () => {
  const MIN_TIME_IN_MINUTES = 30;
  const MAX_TIME_IN_MINUTES = 180;
  const totalMinutes = getRandomInteger(MIN_TIME_IN_MINUTES, MAX_TIME_IN_MINUTES);
  return getTimeOutOfMinutes(totalMinutes);
};

const generateCountry = () => {
  const countries = [
    'Russia',
    'USA',
    'Germany',
    'Australia',
    'Poland',
    'Italy',
    'Finland',
    'India',
  ];
  return getRandomArrayElement(countries);
};

const generateGenres = () => {
  const genres = [
    'Musical',
    'Western',
    'Drama',
    'Comedy',
    'Cartoon',
    'Mystery',
  ];
  return getArrayRandLength(genres);
};

const generateDescription = () => {
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Nunc fermentum tortor. In rutrum ac purus sit amet tempus.',
  ];
  return getRandomArrayElement(descriptions);
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
  const posters = [
    './images/posters/made-for-each-other.png',
    './images/posters/popeye-meets-sinbad.png',
    './images/posters/sagebrush-trail.jpg',
    './images/posters/santa-claus-conquers-the-martians.jpg',
    './images/posters/the-dance-of-life.jpg',
    './images/posters/the-great-flamarion.jpg',
    './images/posters/the-man-with-the-golden-arm.jpg',
  ];
  return getRandomArrayElement(posters);
};

const generateAgeRating = () => {
  const MIN_AGE = 0;
  const MAX_AGE = 18;
  return getRandomInteger(MIN_AGE, MAX_AGE);
};

const generateEmoji = () => {
  const emojis = [
    './images/emoji/angry.png',
    './images/emoji/puke.png',
    './images/emoji/sleeping.png',
    './images/emoji/smile.png'
  ];
  return getRandomArrayElement(emojis);
};

const generateCommentText = () => {
  const texts = [
    'Interesting setting and a good cast',
    'Booooooooooring',
    'Very very old. Meh',
    'Almost two hours? Seriously?'
  ];
  return getRandomArrayElement(texts);
};

const generateCommentAuthor = () => {
  const authors = [
    'Tim Macoveev',
    'John Doe',
    'Ivan Petrov',
    'Den Ivanov',
    'Kirill Sidorov',
  ];
  return getRandomArrayElement(authors);
};

const generateCommentDay = () => {
  const maxDaysGap = 90;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

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
