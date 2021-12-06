import dayjs from 'dayjs';
import {MINUTES_IN_HOURS} from './const';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomFloat = (min = 0.0, max = 1.0, numberDecimals = 1) => {
  const randomValue = Math.random() * (max - min + 1) + min;

  return Number(randomValue.toFixed(numberDecimals));
};

export const getRandomBoolean = () => Boolean(getRandomInteger(0, 1));

export const getRandomArrayElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

export const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

export const getArrayRandLength = (arr) => shuffleArray(arr.slice(0, getRandomInteger(1, arr.length)));

export const getTimeOutOfMinutes = (totalMinutes) => {
  const hours = Math.trunc(totalMinutes / MINUTES_IN_HOURS);
  const minutes = totalMinutes % MINUTES_IN_HOURS;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const truncateText = (text, length) =>  text.length > length ? `${text.slice(0, length)}...` : text;

export const getFormattedDate = (date, format) => dayjs(date).format(format);
