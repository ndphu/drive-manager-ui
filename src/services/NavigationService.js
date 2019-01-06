class NavigationService {

  recentSearches = []

  setLocation = (location) => {
    this.location = location;
  };

  setHistory = (history) => {
    this.history = history;
  };

  goToAccount = (id) => {
    this.history.push(`/account/${id}`)
  };

}

const navigationService = new NavigationService();

export default navigationService;