import axios from 'axios';

export const apiLocalLLM = axios.create({
  baseURL: process.env.apiLocalLLM
});
