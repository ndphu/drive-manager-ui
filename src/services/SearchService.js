import api from '../api/Api';

class SearchService {
  searchFiles = (query) => {
    return api.get(`/search?query=${query}`)
  }
}

const searchService = new SearchService();

export default searchService;