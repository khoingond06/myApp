import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private http = inject(HttpClient);
  getTeam(page: number, size: number, keyword: string,filterset:string,filterStatus:string,filterCompStatus:string,selectedTags:string[],selectedTier:string[]) {
    let url = `${API_ENDPOINTS.TEAM_COMPS.GET_ALL}?page=${page}&size=${size}`
    if (keyword) {
      url += `&keyword=${keyword}`
    }
    if (filterset) {
      url += `&setId=${filterset}`
    }
    if (filterStatus === 'Active') {
      url += `&deleted=false`
    } else if (filterStatus === 'Inactive') {
      url += `&deleted=true`
    }
    if (filterCompStatus === 'Active') {
      url += `&setDeleted=false`
    } else if (filterCompStatus === 'Inactive') {
      url += `&setDeleted=true`
    }
    if (selectedTags) {
      url += `&styles=${selectedTags}`
    }
    if (selectedTier) {
      url += `&tiers=${selectedTier}`
    }

    return this.http.get(url)
  }
  createTeam(data: any) {
    return this.http.post(API_ENDPOINTS.TEAM_COMPS.CREATE, data);
  }
  deleteTeam(id: number) {
    return this.http.delete(API_ENDPOINTS.TEAM_COMPS.DELETE(id));
  }

  deleteTeams(ids: number[]) {
    return this.http.delete(API_ENDPOINTS.TEAM_COMPS.GET_ALL, { body: ids });
  }

}
