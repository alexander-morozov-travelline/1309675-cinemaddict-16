import dayjs from 'dayjs';
import {MINUTES_IN_HOURS} from '../const';

export const getTimeOutOfMinutes = (totalMinutes) => {
  const hours = Math.trunc(totalMinutes / MINUTES_IN_HOURS);
  const minutes = totalMinutes % MINUTES_IN_HOURS;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const truncateText = (text, length) =>  text.length > length ? `${text.slice(0, length)}...` : text;

export const getFormattedDate = (date, format) => dayjs(date).format(format);

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isCtrlEnterEvent = (evt) => evt.key === 'Enter' && evt.ctrlKey;
