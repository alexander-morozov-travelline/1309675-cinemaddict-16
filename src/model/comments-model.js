import AbstractObservable from '../utils/abstract-observable.js';
import {nanoid} from 'nanoid';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = new Map();
  #apiService;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  set comments(comments) {
    this.#comments = [...comments];
  }

  get comments() {
    return this.#comments;
  }

  loadComments = async (idFilm) => {
    let comments;
    try {
      comments = await this.#apiService.getComments(idFilm);
      this.#comments.set(idFilm, comments.map(this.#adaptToClient));
    } catch(err) {
      comments = [];
    }
    this._notify(UpdateType.LOADED_COMMENT, {idFilm: idFilm});
    return comments.map(this.#adaptToClient);
  }

  getCommentsByFilmId = (idFilm) => this.#comments.get(idFilm);

  getCommentIdsByFilmId = (idFilm) => [...this.getCommentsByFilmId(idFilm)].map((comment) => comment.id);

  addComment = (updateType, comment) => {
    const newComment = {id: nanoid(), author: 'Bill', ...comment};
    this.#comments = [
      newComment,
      ...this.#comments,
    ];

    this._notify(updateType, newComment);
  }

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    const deleteComment = {...this.#comments[index]};

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];
    this._notify(updateType, deleteComment);
  }

  #adaptToClient = (comment) => {
    const adaptedComment = {...comment,
      emoji: `./images/emoji/${comment.emotion}.png`,
      text: comment.comment,
      day: comment.date,
    };

    delete adaptedComment['emotion'];
    delete adaptedComment['comment'];
    delete adaptedComment['date'];

    return adaptedComment;
  }
}
