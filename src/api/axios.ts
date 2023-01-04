import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sample.knotapi.com/api',
});

const setToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const registerUser = async (userData: any) => {
  const response = await instance.post('/register', userData);
  setToken(response.data.token);
  return response.data;
};

export const createNewSession = async () => {
  const response = await instance.post('/knot/session', null);
  return response.data;
};
