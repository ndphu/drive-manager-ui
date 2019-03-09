const apiConfig = {
  baseUrl: 'https://drive-manager-api-beta.cfapps.io/api',
  // baseUrl: 'http://localhost:8889/api',
  loginBaseUrl: 'https://drive-manager-api-beta.cfapps.io/api',
  unauthorizedPath: '/#/user/login',
  notFoundPath: '/error/notFound',
};

export default Object.assign({}, apiConfig);