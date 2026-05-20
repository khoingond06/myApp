import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private http = inject(HttpClient);

  getAll() {
    return this.http.get(API_ENDPOINTS.PERMISSIONS.GET_ALL);
  }
  getById(id: number) {
    return this.http.get(API_ENDPOINTS.PERMISSIONS.GET_BY_ID(id));
  }
  create(data: any) {
    return this.http.post(API_ENDPOINTS.PERMISSIONS.CREATE, data);
  }
  delete(id: number) {
    return this.http.delete(API_ENDPOINTS.PERMISSIONS.DELETE(id));
  }
  update(id: number, data: any) {
    return this.http.put(API_ENDPOINTS.PERMISSIONS.UPDATE(id), data);
  }
}
