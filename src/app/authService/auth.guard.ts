import { Injectable } from "@angular/core";
import {CanActivate, Router,ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import { AccountServiceService } from "../services/account-service.service";
import { Observable } from 'rxjs';
  
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private auth: AccountServiceService,
        private router: Router) { }
    canActivate(next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
      if (this.auth.isLoggedIn()) {
        return true;
      }
      this.router.navigate(['login'])
      return false; 
    }
}