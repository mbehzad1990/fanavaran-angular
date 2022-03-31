import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ReportOperationVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-vm';

@Injectable({
  providedIn: 'root'
})
export class PathDataControlGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const navigation = this.router.getCurrentNavigation();
      const urlData = navigation?.extras.state as { data: ReportOperationVm };
      if(urlData){
        return true;
      }
      this.router.navigate(['/remittance/remittance-list']);
      return false;
  }
  
}
