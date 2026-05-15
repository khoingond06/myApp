import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  getUsers(page: number, size: number, keyword: string, status: string) {
    let url = `${API_ENDPOINTS.USER.GET_ALL}?page=${page}&size=${size}`;
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    if (status === 'Active') {
      url += `&enabled=true`;
    } else if (status === 'Inactive') {
      url += `&enabled=false`;
    }
    return this.http.get(url);
  }

  getUserById(id: number) {
    return this.http.get(API_ENDPOINTS.USER.GET_BY_ID(id));
  }
  createUser(data: any) {
    return this.http.post(API_ENDPOINTS.USER.CREATE, data);
  }
  deleteUser(id: number) {
    return this.http.delete(API_ENDPOINTS.USER.DELETE(id));
  }
  updateUser(id: number, data: any) {
    return this.http.put(API_ENDPOINTS.USER.UPDATE(id), data);
  }
}
