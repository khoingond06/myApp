import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../../../features/User/models/user.model';
import { API_ENDPOINTS } from '../../constants/api.constants';
import { STORAGE_KEYS } from '../../constants/storage.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.SIGN_IN, request);
  }
  register(request:RegisterRequest){
    return this.http.post<RegisterResponse>(API_ENDPOINTS.AUTH.SIGN_UP, request);
  }
  refreshToken(token: string){
    return this.http.post<LoginResponse>(`${API_ENDPOINTS.AUTH.SIGN_IN}/refresh`, { refreshToken: token });
  }

  saveToken(accessToken: string, refreshToken: string, user?: User): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
    }
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  getUserInfo(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
  }
}
