import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) { }
  getItems(page: number, size: number, keyword?: string,set?:string,tier?:string,itemStatus?:string,setStatus?:string) {
    let url = `${API_ENDPOINTS.ITEMS.GET_ALL}?page=${page}&size=${size}`;
    if (keyword) {
      url += `&keyword=${keyword}`;
    }
    if(set){
      url +=`&setId=${set}`;
    }
    if(tier){
      url +=`&tier=${tier}`;
    }
    if(itemStatus === "active"){
      url +=`&itemDeleted=false`;
    }else if(itemStatus === "inactive"){
      url +=`&itemDeleted=true`;
      
    }
    if(setStatus === "active"){
      url +=`&setDeleted=false`;
    }
    else if(setStatus === "inactive"){
      url +=`&setDeleted=true`;
    }
    return this.http.get(url);
  }

  findById(id: number) {
    return this.http.get(API_ENDPOINTS.ITEMS.FIND_BY_ID(id));
  }

  createItem(data: any) {
    return this.http.post(API_ENDPOINTS.ITEMS.CREATE, data);
  }

  deleteItem(id: number) {
    return this.http.delete(API_ENDPOINTS.ITEMS.DELETE(id));
  }
  deleteItems(ids: number[]) {
    return this.http.delete(API_ENDPOINTS.ITEMS.GET_ALL, { body: { ids: ids } });
  }
}