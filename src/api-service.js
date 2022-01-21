const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get filmsList() {
    return this.#load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  getComments = (idFilm) => this.#load({url: `comments/${idFilm}`}).then(ApiService.parseResponse);

  addComment = async (comment) => {
    const response = await this.#load({
      url: 'comments',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  deleteComment = async (comment) => {
    const response = await this.#load({
      url: `comments/${comment.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);
    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const filmInfo = {
      'title': film.title,
      'age_rating': film.ageRating,
      'alternative_title': film.titleOriginal,
      'director': film.director,
      'writers': film.writers,
      'actors': film.actors,
      'runtime': film.runtime,
      'release': {
        'date': film.releaseDate instanceof Date ? film.releaseDate.toISOString() : null,
        'release_country': film.country
      },
      'genre': film.genres,
      'description': film.description,
      'total_rating': film.rating,
      'poster': film.poster,
    };
    const userDetails = {
      'already_watched': film.isWatched,
      'watchlist': film.isWatchList,
      'watching_date': film.watchingDate instanceof Date ? film.watchingDate.toISOString() : null,
      'favorite': film.isFavorite,
    };

    const adaptedFilm = {
      'id': film.id,
      'comments': film.comments,
      'film_info': filmInfo,
      'user_details': userDetails,
    };

    return adaptedFilm;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
