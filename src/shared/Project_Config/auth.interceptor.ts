import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { FacadService } from '../Service/_Core/facad.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isTokenRefreshing: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null!);
  constructor(private _coreService:FacadService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger
    return next.handle(this.setTokenRequest(request)).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {

        }
      }),
      catchError((error: any): Observable<any> => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return this.handleHttpResponseError(request, next);
          }else{
            return <any>this._coreService.auth.logOut();
          }
        }
        return of(null);
      })
    )
  }
  private setTokenRequest(request: HttpRequest<any>) {
    try {
      let jwt = this._coreService.auth.getAuthAllDataFromLocalStorage()!;
      if (jwt != null || jwt != undefined) {
        return request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt.jwtToken}`
          }
        })
      }
      return request;
    } catch (error) {
      console.log('setTokenRequest_Error: ' + error);
      return request;
    }


  }
  private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler):any {

    if (!this.isTokenRefreshing) {
      this.isTokenRefreshing = true;
      this.tokenSubject.next(null!);
      const sb=this._coreService.auth.generateJWTToken().subscribe(result=>{
        if(result){
          this.tokenSubject.next(result.jwtToken);
          return next.handle(this.setTokenRequest(request));
        }else{
          this.isTokenRefreshing = false;
        }
        return <any>this._coreService.auth.logOut();
      })
      
    } else {
      this.isTokenRefreshing = false;
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          return next.handle(this.setTokenRequest(request));
        })
      );
    }
  }
  private handleError(errorRespose: HttpErrorResponse) {
    let errorMsg: string;
    if (errorRespose.error instanceof Error) {
      errorMsg = "An error occured : " + errorRespose.error.message;
    } else {
      errorMsg = `Backend return code ${errorRespose.status}, boday was: ${errorRespose.error}`;
    }
    return throwError("Error" + errorMsg);
  }
}