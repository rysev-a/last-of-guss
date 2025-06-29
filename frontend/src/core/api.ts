import axios, { Axios } from "axios";

export interface SignUpData {
  email: string;
  username: string;
  password: string;
}

class Api {
  httpClient: Axios;
  baseUrl: string;

  constructor(httpClient: Axios, baseUrl: string) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
  }

  signUp(signUpData: SignUpData) {
    return this.httpClient.post(`${this.baseUrl}/auth/signup`, signUpData);
  }
}

const api = new Api(axios, "/api/v1");

export default api;
