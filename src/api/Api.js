import 'whatwg-fetch';
import config from './Config.js';
import navigationService from '../services/NavigationService';

class Api {
  buildHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  get = (path) => {
    return fetch(config.baseUrl + path, {
      method: 'GET',
      headers: this.buildHeaders()
    }).then(resp => {
      if (resp.status === 401) {
        window.location.href = config.unauthorizedPath;
      } else if (resp.status === 404) {
        navigationService.goTo(config.notFoundPath);
      } else {
        return resp.json();
      }
    });
  };

  post = (path, body, raw) => {
    const input = config.baseUrl + path;
    return fetch(input, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: raw ? body : JSON.stringify(body),
    }).then(resp => {
      if (resp.status === 401) {
        window.location.href = config.unauthorizedPath;
      } else {
        return resp.json()
      }
    });
  };


  fetchBlob = (url) => {
    return fetch(url).then(resp => resp.blob())
  }

}

const api = new Api();
export default api;
