import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  constructor() {}
  getAllNotification(){
    return this.http.get(API_ENDPOINTS.NOTIFICATION.GET_ALL)
  }
  sendNotification(data:any){
    return this.http.post(API_ENDPOINTS.NOTIFICATION.CREATE, data)
  }
}
