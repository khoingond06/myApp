import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ChampionService {
  constructor(private http: HttpClient) {}

  getChampions(
    page: number,
    size: number,
    keyword?: string,
    setId?: string,
    cost?: string,
    trait?: string,
    tier?: string,
    deleted?: string,
    unassignedSet?: string
  ) {
    let url = `${API_ENDPOINTS.CHAMPION.GET_ALL}?page=${page}&size=${size}`;
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    if (setId) {
      url += `&setId=${setId}`;
    }
    if (cost) {
      url += `&cost=${cost}`;
    }
    if (trait) {
      url += `&trait=${trait}`;
    }
    if (tier) {
      url += `&tier=${tier}`;
    }
    if (deleted === 'active') {
      url += `&deleted=false`;
    } else if (deleted === 'inactive') {
      url += `&deleted=true`;
    }
    if (unassignedSet === 'active') {
      url += `&unassignedSet=false`;
    } else if (unassignedSet === 'inactive') {
      url += `&unassignedSet=true`;
    }
    console.log('Fetching champions with URL:', url);
    return this.http.get(url);
  }

  getChampionById(id: number) {
    return this.http.get(API_ENDPOINTS.CHAMPION.GET_BY_ID(id));
  }

  deleteChampion(id: number) {
    return this.http.delete(API_ENDPOINTS.CHAMPION.DELETE(id));
  }

  deleteChampions(ids: number[]) {
    return this.http.delete(API_ENDPOINTS.CHAMPION.BULK_DELETE, { body: { ids: ids } });
  }
}
