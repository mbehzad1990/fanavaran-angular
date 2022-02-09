import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { User } from 'src/shared/Domain/Models/_User/user';
import { RegisterVm } from 'src/shared/Domain/ViewModels/_User/register-vm';
import { FacadService } from '../_Core/facad.service';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnDestroy {
  //#region private
  private apiVersion = '1';
  private baseUrl =environment.serverUrl+ `/api/v${this.apiVersion}/Auth/`;
  private _unsubscribe: Subscription[] = [];

  private _user$ = new BehaviorSubject<User[]>([]);
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
  get user$() {
    return this._user$.asObservable();
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

  constructor(private http: HttpClient, private _coreService: FacadService) {
    if (this._user$.value.length == 0 || this._user$.getValue().length == 0) {
      this.getAllUsers();
    }
  }

  getAllUsers() {
    this._isLoading$.next(true);
    const sb = this.http
      .get<ResultDto<User[]>>(this.baseUrl + 'GetAll')
      .pipe(
        map((result: ResultDto<User[]>) => {
          if (result.data) {
            this._user$.next(result.data);
          }
          if (!result.isSuccess) {
            this._coreService.notification.showNotiffication(
              NotificationType.Error,
              this._coreService.errorHandler.getErrorText(result.resultAction)
            );
          }
          if (result.exception) {
            this._coreService.notification.showNotiffication(
              NotificationType.Error,
              result.exception
            );
          }
        }),
        catchError((err) => {
          this._coreService.notification.showNotiffication(
            NotificationType.Error,
            err
          );

          return of(null);
        }),
        finalize(() => {
          this._isLoading$.next(false);
          this._isCompleteStep$.next({ searc: true });
        }),
        shareReplay()
      )
      .subscribe();
    this.subscriptions.push(sb);
  }
  registerUser(registerVm: RegisterVm){
    this._isLoading$.next(true);
    return this.http
      .post<ResultDto<boolean>>(this.baseUrl + 'Register', registerVm)
      .pipe(
        map((result:ResultDto<boolean>)=>{
          if(result.isSuccess){
            this.getAllUsers();
          }
          return result;
        }),
        catchError((err) => {
          this._coreService.notification.showNotiffication(
            NotificationType.Error,
            err
          );

          return of(null);
        }),
        finalize(() => {
          this._isLoading$.next(false);
          this._isCompleteStep$.next({ searc: true });
        }),
        shareReplay()
      );
  }
  deleteUser(userId:number){
    this._isLoading$.next(true);
    return this.http.delete<ResultDto<boolean>>(this.baseUrl+`Delete?Id=${userId}`).pipe(
      map((result:ResultDto<boolean>)=>{
        if(result.isSuccess){
          this.getAllUsers();
        }
        return result;
      }),
      catchError((err) => {
        this._coreService.notification.showNotiffication(
          NotificationType.Error,
          err
        );
        return of(null);
      }),
      finalize(() => {
        this._isLoading$.next(false);
        this._isCompleteStep$.next({ searc: true });
      }),
      shareReplay()
    );

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
