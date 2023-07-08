import axios from 'axios';

import { getUserToken } from '~/utils/cookies';

const instance = axios.create({ baseURL: process.env.apiBaseUrl });

const clientApi = (token) => {
  const tokenRequest = token || getUserToken();

  instance.defaults.headers.common['Authorization'] = tokenRequest
    ? `Bearer ${tokenRequest}`
    : '';

  return instance;
};

const apiV2 = axios.create({baseURL: process.env.apiV2})

export default clientApi;

export {apiV2}
