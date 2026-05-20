import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CmsService {
  constructor(private http: HttpClient) { }
  getSets(page: number, size: number, keyword: string = '', status: string = 'All') {
    let url = `${API_ENDPOINTS.SET.GET_ALL}?page=${page}&size=${size}`;
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    if (status === 'Active') {
      url += `&deleted=false`;
    } else if (status === 'Inactive') {
      url += `&deleted=true`;
    }
    return this.http.get(url);
  }
  
  createSet(data: any) {
    return this.http.post(API_ENDPOINTS.SET.CREATE, data);
  }

  getSetById(id: number) {
    return this.http.get(API_ENDPOINTS.SET.GET_BY_ID(id));
  }

  getChampionsBySetId(setId: number) {
    return this.http.get(API_ENDPOINTS.CHAMPION.GET_BY_SET(setId));
  }

  updateSet(id: number, data: any) {
    return this.http.put(API_ENDPOINTS.SET.UPDATE(id), data);
  }
  
  deleteSet(id: number) {
    return this.http.delete(`${API_ENDPOINTS.SET.DELETE(id)}`);
  }

  deleteSets(ids: number[]) {
    return this.http.delete(API_ENDPOINTS.SET.GET_ALL, { body: { ids: ids } });
  }



  getItems(page: number, size: number) {
    return this.http.get(`${API_ENDPOINTS.ITEMS.GET_ALL}?page=${page}&size=${size}&sortBy=createdAt&sortDir=desc`);
  }


  getTeamComps(page: number, size: number) {
    return this.http.get(`${API_ENDPOINTS.TEAM_COMPS.GET_ALL}?page=${page}&size=${size}`);
  }


  notification() {
    return this.http.get(API_ENDPOINTS.NOTIFICATION.GET_ALL);
  }
  myInfo() {
    return this.http.get(API_ENDPOINTS.MY_INFO.GET_ALL);
  }
  getUser() {
    return this.http.get(API_ENDPOINTS.USER.GET_ALL);
  }
}
