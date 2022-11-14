import axios from 'axios';
import Config from 'react-native-config';

const instance = axios.create({
  baseURL: 'https://sample.knotapi.com/api',
  headers: {
    Environment: Config.KNOTAPI_ENVIRONMENT,
    'Client-Id': Config.KNOTAPI_CLIENT_ID,
    'Client-Secret': Config.KNOTAPI_SECRET,
  },
});

const setToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const registerUser = async (userData: any) => {
  const response = await instance.post('/register', userData);
  setToken(response.data.token);
  return response.data;
};

export const createNewSession = async (
  type: 'subscription_canceller' | 'card_switcher',
) => {
  const response = await instance.post('/knot/session', {type});
  return response.data;
};

export type SubscriptionData = {
  description: string;
  amount: number;
  date: string;
};
export const createTransaction = async (data: SubscriptionData) => {
  const response = await instance.post('/transactions/new', data);
  return response.data;
};
