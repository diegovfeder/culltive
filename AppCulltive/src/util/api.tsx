import axios from 'axios';

const api = axios.create({
  baseURL: 'https://us-central1-culltive.cloudfunctions.net/api',
});

//TODO: setAuthorizationHeader

export default api;
