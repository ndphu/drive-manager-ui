import api from '../api/Api';

class SearchService {
  quickSearch = (query) => {
    return api.get(`/search/quickSearch?query=${query}`)
  }
}

const searchService = new SearchService();

export default searchService;