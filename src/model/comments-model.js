import AbstractObservable from '../utils/abstract-observable.js';
import {UpdateType} from '../const';

export default class CommentsModel extends AbstractObservable {
  #comments = new Map();
  #apiService;

  constructor(apiService) {
    super();
    this.#apiService = apiService;
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

  addComment = async (updateType, update) => {
    const {comment, idFilm} = update;
    try {
      const response = await this.#apiService.addComment(comment);
      const newComment = this.#adaptToClient(response);
      const comments = this.getCommentsByFilmId(idFilm);
      const newComments = [
        this.#adaptToClient(newComment),
        ...comments,
      ];
      this.#comments.set(idFilm, newComments);
      this._notify(updateType, newComment);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  deleteComment = async (updateType, update) => {
    const {comment, idFilm} = update;
    const comments = this.getCommentsByFilmId(idFilm);

    if (!comments) {
      throw new Error('Can\'t delete comments for film');
    }

    const index = comments.findIndex((item) => item.id === comment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(comment);
      const newComments = [
        ...comments.slice(0, index),
        ...comments.slice(index + 1),
      ];
      this.#comments.set(idFilm, newComments);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
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
