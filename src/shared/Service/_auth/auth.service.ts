import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { LoginResponsDto } from 'src/shared/Domain/Dto/_User/login-respons-dto';
import { UserDetail } from 'src/shared/Domain/Dto/_User/user-detail';
import { UserTokenGenerateDto } from 'src/shared/Domain/Dto/_User/user-token-generate-dto';
import { ResultAction } from 'src/shared/Domain/Enums/global-enums';
import { LoginInputVm } from 'src/shared/Domain/ViewModels/login-input-vm';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //#region private
  private AUTH_KEY = 'userToken';
  private apiVersion = '1';
  private baseUrl =environment.serverUrl+ `/api/v${this.apiVersion}/Auth/`;
  private _unsubscribe: Subscription[] = [];

  // private _deviceSearched$ = new BehaviorSubject<DeviceInsertedModel[]>([]);
  // private _devices$ = new BehaviorSubject<DeviceModel[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isCompleteStep$ = new BehaviorSubject<{}>({});
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage = new BehaviorSubject<string>('');
  //#endregion

  //#region public
  //#endregion

  //#region Getter
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isCompletePrcess$() {
    return this._isCompleteStep$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._unsubscribe;
  }
  //#endregion

  constructor(private http: HttpClient,private router: Router) {}

  login(loginModel: LoginInputVm) {
    
    this._isLoading$.next(true);
    return this.http
      .post<ResultDto<LoginResponsDto>>(this.baseUrl + 'Login', loginModel)
      .pipe(
        
        map((resp: ResultDto<LoginResponsDto>) => {
          if (resp.isSuccess) {
            this.setAuthDataInLocalStorage(resp.data);
          }
          return resp;
        }),
        catchError((err) => {
          const customResult=new ResultDto<boolean>();
          customResult.isSuccess=false;
          customResult.resultAction=ResultAction.ServiceException;
          customResult.location='';
          console.error('login_Error', err);
          return of(customResult);
        }),
        finalize(() => {
          this._isLoading$.next(false);
        }),
        shareReplay()
      );
  }
  generateJWTToken() {
    this._isLoading$.next(true);
    const tokenSaved = this.getAuthAllDataFromLocalStorage();
    let userRefreshToken = new UserTokenGenerateDto();
    userRefreshToken.refreshToken = tokenSaved?.refreshToken;
    userRefreshToken.userId=tokenSaved.userId;
    userRefreshToken.userName=tokenSaved.userName;
    return this.http.post<ResultDto<LoginResponsDto>>(this.baseUrl+"GenerateAuthToken",userRefreshToken).pipe(
      map((resp:ResultDto<LoginResponsDto>)=>{
        if(resp.isSuccess){
          this.clearLocalStorageToken();
          this.setAuthDataInLocalStorage(resp.data);
        }
        return resp.data;
      }),
      catchError((err) => {
        //this.logOut()
        console.error('generateJWTToken', err);
        return of(null);
      }),
      finalize(() => {
        this._isLoading$.next(false);
      }),
      shareReplay()
    );
  }
  logOut(){
    this.clearLocalStorageToken();
   this.router.navigateByUrl('/auth');
    // this.router.navigate(['auth/login'], {
    //   queryParams: {},
    // });
  }

  setAuthDataInLocalStorage(auth: LoginResponsDto): boolean {
    if (auth && auth.jwtToken) {
      sessionStorage.setItem(this.AUTH_KEY, JSON.stringify(auth));
      // localStorage.setItem(this.AUTH_KEY, JSON.stringify(auth));
      return true;
    }
    return false;
  }
  getAuthAllDataFromLocalStorage(): LoginResponsDto {
    const authData = JSON.parse(sessionStorage.getItem(this.AUTH_KEY)!);
    return authData;
  }
  clearLocalStorageToken() {
    return sessionStorage.removeItem(this.AUTH_KEY);
  }
  getTokenData() {
    let token = localStorage.getItem(this.AUTH_KEY)!;
    return JSON.parse(token);
  }
  getUserDetail(){
    const user=this.getAuthAllDataFromLocalStorage();
    if(user){
      let userDetail=new UserDetail();
      userDetail.name=user.name;
      userDetail.userName=user.userName;
      userDetail.userId=user.userId;
      return userDetail;
    }else{
      let userDetail2=new UserDetail();
      userDetail2.name='خطا در نمایش اطلاعات کاربر';
      userDetail2.userName='خطا در نمایش نام کاربری';
      userDetail2.userId=0;
      return userDetail2;
    }

  }
}
