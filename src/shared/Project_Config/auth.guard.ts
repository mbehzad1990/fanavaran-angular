import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FacadService } from '../Service/_Core/facad.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private _coreService:FacadService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const current_user_token = this._coreService.auth.getAuthAllDataFromLocalStorage();
      if (current_user_token !== null) {
        // if (!this.authHelper.checkRefreshokenValidation()) {
        //   // اگر مدت زمان رفرش توکن تموم سده باشه یا وجود نداشته باشه
        //   this.authService.logOut();
        //   return false;
        // }
        return true;
      } else {
         this._coreService.auth.logOut();
        return false;
      }
  }
  
}
