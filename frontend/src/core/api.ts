import axios, { Axios } from "axios";

export interface SignUpData {
  email: string;
  username: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class Api {
  httpClient: Axios;
  baseUrl: string;

  constructor(httpClient: Axios, baseUrl: string) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
    this.loadHeaders();
  }

  loadHeaders() {
    if (localStorage.getItem("token")) {
      this.setHeaderToken(localStorage.getItem("token") as string);
    }
  }

  setHeaderToken(token: string) {
    this.httpClient.defaults.headers.common["Authorization"] = token;
  }

  resetHeaderToken() {
    delete this.httpClient.defaults.headers.common["Authorization"];
  }

  signUp(signUpData: SignUpData) {
    return this.httpClient.post(`${this.baseUrl}/auth/signup`, signUpData);
  }

  login(loginData: LoginData) {
    return this.httpClient.post(`${this.baseUrl}/auth/login`, loginData);
  }

  account() {
    return this.httpClient.get(`${this.baseUrl}/auth/account`);
  }
}

const api = new Api(axios, "/api/v1");

export default api;
