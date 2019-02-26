import firebase from 'firebase/app';
import 'firebase/auth'
import api from '../api/Api';


class AuthService {
  authenticated = false;
  user = null;

  getCurrentUser = () => {
    return this.user;
  };

  setUser = (user) => {
    this.user = user;
  };

  loginWithEmail = (email, password) => {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
        firebase.auth().currentUser.getIdToken(true).then(token => {
            this.getJWTToken(token).then(resp => {
              this.authenticated = true;
              api.setToken(resp.jwtToken);
              this.setUser(resp.user);
              resolve(resp.user);
            });
          }
        );
      }).catch(function (err) {
        reject(err);
      });
    });
  };

  isAuthenticated = () => {
    return this.authenticated;
  };

  getJWTToken = (idToken) => {
    return api.post(`/user/login/firebase`, {token: idToken})
  };

  registerUserWithEmail = (email, password, displayName) => {
    return api.post(`/user/register`, {
      email: email,
      password: password,
      displayName: displayName,
    })
  };

  getUserInfo = () => {
    return api.get(`/user/manage/info`)
  };

  saveServiceAccountAdminKey = (keyValue) => {
    return api.post(`/user/manage/adminKey`, btoa(keyValue), true)
  };

  increaseStorage = (accountInfo) => {
    if (accountInfo) {

    } else {
      return api.post(`/user/manage/increaseStorage`)
    }
  };

  createServiceToken = () => {
    return api.post(`/user/manage/createServiceToken`)
  };
}

const authService = new AuthService();

export default authService;