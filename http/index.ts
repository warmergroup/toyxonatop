import axios from 'axios';

export const API_URL = 'http://api.toyxonatop.uz'

const $axios = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
});

export default $axios;
