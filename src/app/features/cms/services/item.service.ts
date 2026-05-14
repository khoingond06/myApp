import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) { }
  getItems(page: number, size: number, keyword?: string) {
    let url = `${API_ENDPOINTS.ITEMS.GET_ALL}?page=${page}&size=${size}`;
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    return this.http.get(url);
  }

  createItem(data: any) {
    return this.http.post(API_ENDPOINTS.ITEMS.CREATE, data);
  }

  deleteItem(id: number) {
    return this.http.delete(API_ENDPOINTS.ITEMS.DELETE(id));
  }
}