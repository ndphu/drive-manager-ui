class NavigationService {

  recentSearches = [];

  setLocation = (location) => {
    this.location = location;
  };

  setHistory = (history) => {
    this.history = history;
  };

  goToAccount = (id) => {
    this.history.push(`/account/${id}`)
  };

  goToAccountsPage(page, rowsPerPage) {
    this.history.push(`/accounts?page=${page}&size=${rowsPerPage}`)
  }

  goToVideoView(accountId, fileId) {
    this.history.push(`/view/video?accountId=${accountId}&fileId=${fileId}`)
  }

  goTo = (path) => {
    this.history.push(path);
  };

  goToAccounts = () => {
    this.history.push('/accounts');
  };
}

const navigationService = new NavigationService();

export default navigationService;