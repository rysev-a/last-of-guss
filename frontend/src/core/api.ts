import axios, { Axios } from "axios";
import type { GameType } from "@/domains/types";

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
    localStorage.clear();
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

  getGameSettings() {
    return this.httpClient.get(`${this.baseUrl}/games/settings`);
  }

  getGameList() {
    return this.httpClient.get<GameType[]>(`${this.baseUrl}/games`);
  }

  getGameDetail(id: string) {
    return this.httpClient.get<GameType>(`${this.baseUrl}/games/${id}`);
  }

  createGame({ title }: { title: string }) {
    return this.httpClient.post(`${this.baseUrl}/games`, { title });
  }

  joinToGame(id: string) {
    return this.httpClient.post(`${this.baseUrl}/games/${id}/join`);
  }

  tap(id: string) {
    return this.httpClient.post(`${this.baseUrl}/games/${id}/tap`);
  }
}

const api = new Api(axios, "/api/v1");

export default api;
