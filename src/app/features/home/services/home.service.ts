import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient){}
}
