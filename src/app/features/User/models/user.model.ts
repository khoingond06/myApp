export interface User {
  username: string;
  email?: string;
  password?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user?: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
  code: string;
  detail: string;
}
export interface RegisterResponse {
  success: boolean;
  message: string;
  code: string;
  detail: string;
}
