import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get(API_ENDPOINTS.ROLE.GET_ALL);
  }
  getById(id: number) {
    return this.http.get(API_ENDPOINTS.ROLE.GET_BY_ID(id));
  }
  create(data: any) {
    return this.http.post(API_ENDPOINTS.ROLE.CREATE, data);
  }
  delete(id: number) {
    return this.http.delete(API_ENDPOINTS.ROLE.DELETE(id));
  }
  update(id: number, data: any) {
    return this.http.put(API_ENDPOINTS.ROLE.UPDATE(id), data);
  }
  updatePermissions(id: number, data: any) {
    return this.http.put(API_ENDPOINTS.ROLE.UPDATE_PERMISSIONS(id), data);
  }
}
