const apiConfig = {
  // baseUrl: 'https://drive-manager-api-interested-waterbuck.cfapps.io/api',
  baseUrl: 'http://localhost:8889/api',
  // loginBaseUrl: 'https://drive-manager-api-interested-waterbuck.cfapps.io/api',
    loginBaseUrl: 'http://localhost:8889/api',
  unauthorizedPath: '/#/user/login',
  notFoundPath: '/error/notFound',
};

export default Object.assign({}, apiConfig);