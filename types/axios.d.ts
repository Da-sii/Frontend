import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    disableRedirect?: boolean;
  }
}
