import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountServiceService {
  private jwtHelper: JwtHelperService;
  headers!: HttpHeaders;
  loger = new BehaviorSubject<boolean>(false);
  Profile = new BehaviorSubject<string>("");

  constructor(private _http: HttpClient) { 
    this.jwtHelper = new JwtHelperService();
    this.headers = new HttpHeaders({'Content-Type': 'multipart/form-data'});
  }

  decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  getClaim(token: any, claimKey: any): any {
    const decodedTokens = this.decodeToken(token);
    // console.log(decodedTokens.claimKey)
    return decodedTokens[claimKey];
  }

  postLoginData(data: any): Observable<any> {
    return this._http.post("https://localhost:7038/api/Account/Login", data );
  }

  getToken(){
    return localStorage.getItem("token");
  }

  isLoggedIn():boolean{
    return !!localStorage.getItem("token");
  }

  createUser(data: any): Observable<any>{
    return this._http.post("https://localhost:7038/api/Account/SignUp", data);
  }

  GetUser(data:any){
    return this._http.get("https://localhost:7038/api/Account/GetUser/" + data);
  }

  logOut(){
    localStorage.clear();
    return;
  }

  EditUserProfile(data:any):Observable<any>{
    return this._http.post("https://localhost:7038/api/Account/EditProfile/" + data.Id , data);
  }

  GetProfile(){
    var token = this.getToken();
    var Id= this.getClaim(token,'id');
    return this._http.get("https://localhost:7038/api/Account/GetUser/"+ Id, Id);
  }
}
