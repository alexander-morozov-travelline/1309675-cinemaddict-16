import dayjs from 'dayjs';
import {MINUTES_IN_HOURS} from '../const';

export const getTimeOutOfMinutes = (totalMinutes) => {
  const hours = Math.trunc(totalMinutes / MINUTES_IN_HOURS);
  const minutes = totalMinutes % MINUTES_IN_HOURS;

  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const truncateText = (text, length) =>  text.length > length ? `${text.slice(0, length)}...` : text;

export const getHumanFormattedDate = (date) => {
  const diffYear = dayjs(new Date()).diff(dayjs(date), 'year');
  if(diffYear>1){
    return `${diffYear} years ago`;
  }

  const diffMonth = dayjs(new Date()).diff(dayjs(date), 'month');
  if(diffMonth>1) {
    return `${diffMonth} month ago`;
  }

  const diffDays = dayjs(new Date()).diff(dayjs(date), 'day');
  if(diffDays>1){
    return `${diffDays} days ago`;
  }

  const diffHours = dayjs(new Date()).diff(dayjs(date), 'hour');
  if(diffHours>1){
    return `${diffHours} hours ago`;
  }

  const diffMinutes = dayjs(new Date()).diff(dayjs(date), 'minute');
  if(diffMinutes>1){
    return `${diffMinutes} minutes ago`;
  }

  return 'now';
};

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const isCtrlEnterEvent = (evt) => evt.key === 'Enter' && evt.ctrlKey;
