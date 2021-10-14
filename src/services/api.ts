import axios, { AxiosError } from 'axios';
import { parseCookies, setCookie } from 'nookies';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [];

export const api = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    Authorization: `Bearer ${cookies['auth-app.token']}`,
  },
});

axios.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response.data?.code === 'token.expired') {
        // refresh token
        cookies = parseCookies();

        const { 'auth-app.refreshToken': refreshToken } = cookies;

        // return to originalConfig made for backend (routes, callback, params...)
        const originalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post('/refresh', { refreshToken })
            .then(response => {
              const { token } = response.data;

              setCookie(undefined, 'auth-app.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
              });

              setCookie(
                undefined,
                'auth-app.refreshToken',
                response.data.refreshToken,
                {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                }
              );

              api.defaults.headers['Authorization'] = `Bearer ${token}`;

              failedRequestsQueue.forEach(request =>
                request.onSuccess(token as string)
              );
              failedRequestsQueue = [];
            })
            .catch(error => {
              failedRequestsQueue.forEach(request => request.onFailure(error));
              failedRequestsQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({
            // refresh token success
            onSuccess: (token: string) => {
              originalConfig.headers['Authorization'] = `Bearer ${token}`;

              resolve(api(originalConfig));
            },
            // refresh token error
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        // logout
      }
    }
  }
);
