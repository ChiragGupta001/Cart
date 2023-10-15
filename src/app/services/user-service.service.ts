import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AccountServiceService } from './account-service.service';
import { Observable, catchError, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  
  headers!: HttpHeaders;
  auth_token = localStorage.getItem("token");

  constructor(private _http:HttpClient){
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', })
    this.headers = new HttpHeaders().set('Authorization', `Bearer ${this.auth_token}`)
  }

  getData(pagesize: number, pageNum: number, sortOrder: string, sortDirection: string, searchTerm: string) {
    return this._http.get(`https://localhost:7038/api/Item/search?sortOrder=${sortOrder}&sortDirection=${sortDirection}&searchTerm=${searchTerm}&pageSize=${pagesize}&pageNumber=${pageNum}`, { headers: this.headers });
  }

  addData(data: any): Observable<any> {
    return this._http.post('https://localhost:7038/api/Item/AddProduct', data, { headers: this.headers });
  }

  getById(id: any) {
    return this._http.get("https://localhost:7038/api/Item/GetById/" + id, { headers: this.headers });
  }

  updateItem(data: any): Observable<any>{
    return this._http.put<any>('https://localhost:7038/api/Item/UpdateProduct/' + data.id, data , { headers: this.headers });
  }

  deleteItem(id: any) {
    return this._http.delete<any>('https://localhost:7038/api/Item/DeleteProduct/' + id, { headers: this.headers });
  }

  private option={
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.auth_token}`
    }),
    responseType: 'blob' as 'json'
  };
  downloadExcel(){
    return this._http.get('https://localhost:7038/api/Item/EeportToExcel', this.option);
  }

  ExportFromExcel(data:any){
    return this._http.post("https://localhost:7038/api/Item/ImportFromExcel",data,{headers:this.headers});
  }
}
