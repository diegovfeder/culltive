import axios from 'axios';

const api = axios.create({
  baseURL: 'https://us-central1-culltive.cloudfunctions.net/api',
});

export default api;
