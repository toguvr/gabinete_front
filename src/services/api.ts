import axios, { AxiosError, AxiosInstance } from 'axios';
import { key } from '../config/key';

let isRefreshing = false;
let failedRequestQueue = [] as Array<{
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError) => void;
}>;

type ModifyAxiosInstance = AxiosInstance & {
  registerInterceptTokenManager(signOut: () => void): void;
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API,
}) as ModifyAxiosInstance;

api.registerInterceptTokenManager = (signOut: () => void) => {
  api.interceptors.response.use(
    (response: any) => {
      return response;
    },
    async (error: any) => {
      if (error.response?.status === 401) {
        if (error?.response?.data?.message === 'Token expirou, refaça o login.') {
          const refreshToken = await localStorage.getItem(key.refreshToken);

          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            api
              .post('/sessions/refresh-token', {
                current_refresh_token: refreshToken,
              })
              .then(async (response: any) => {
                const { token, refresh_token: refreshToken } = response.data;

                await localStorage.multiSet([
                  [key.token, token],
                  [key.refreshToken, refreshToken],
                ]);

                api.defaults.headers.authorization = `Bearer ${token}`;

                failedRequestQueue.forEach((request) => request.onSuccess(token));
                failedRequestQueue = [];
              })
              .catch((err) => {
                failedRequestQueue.forEach((request) => request?.onFailure(err));
                failedRequestQueue = [];

                signOut();
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers.authorization = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        }

        signOut();
      }

      return Promise.reject(error);
    }
  );
};

export default api;
