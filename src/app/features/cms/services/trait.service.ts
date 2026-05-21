import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class TraitService {
  constructor(private http: HttpClient) {}

  getTraits(page: number, size: number, keyword?: string, setId?: string, type?: string, status?: string, restorable?: string) {
    let url = `${API_ENDPOINTS.TRAIT.GET_ALL}?page=${page}&size=${size}&includeDeleted=true`;
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    if (setId) {
      url += `&setId=${setId}`;
    }
    if (type) {
      url += `&type=${type}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    if (restorable === 'can_restore') {
      url += `&restorable=true`;
    } else if (restorable === 'cannot_restore') {
      url += `&restorable=false`;
    }
    console.log('Fetching traits with URL:', url);
    return this.http.get(url);
  }

  getTraitById(id: number) {
    return this.http.get(`${API_ENDPOINTS.TRAIT.GET_ALL}/${id}`);
  }

  deleteTrait(id: number) {
    const url = API_ENDPOINTS.TRAIT.DELETE(id);
    console.log(`Deleting trait with ID: ${id}, URL: ${url}`);
    return this.http.delete(url);
  }

  deleteTraits(ids: number[]) {
    const url = API_ENDPOINTS.TRAIT.BULK_DELETE;
    console.log(`Bulk deleting traits with IDs:`, ids, `URL: ${url}`);
    return this.http.delete(url, { body: { ids: ids } });
  }
}
