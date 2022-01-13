import {getRandomArrayElement, getRandomInteger} from '../utils/common';
import {MAX_DAYS_GAP} from '../const';
import dayjs from 'dayjs';

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

const generateItemComment = (idComment, idFilm) => ({
  id: idComment,
  idFilm: idFilm,
  emoji: generateEmoji(),
  text: generateCommentText(),
  author: generateCommentAuthor(),
  day: generateCommentDay(),
});

export const generateComments = (filmList) => {
  const comments = [];
  filmList.forEach((film) => {
    film.comments.forEach((comment) => {
      comments.push(generateItemComment(comment, film.id));
    });
  });

  return comments;
};
