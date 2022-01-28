import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { RegisterOperationVm } from 'src/shared/Domain/ViewModels/_Operation/register-operation-vm';
import { FacadService } from '../_Core/facad.service';

@Injectable({
  providedIn: 'root'
})
export class OperationService implements OnDestroy {
  //#region private
  private apiVersion = '1';
  private baseUrl = `api/v${this.apiVersion}/Operation/`;
  private _unsubscribe: Subscription[] = [];

  // private _user$ = new BehaviorSubject<User[]>([]);
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
  // get user$() {
  //   return this._user$.asObservable();
  // }
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
  constructor(private http: HttpClient, private _coreService: FacadService) { }


    // Get

    // Post
    RegisterOperation(opModel: RegisterOperationVm) {
      this._isLoading$.next(true);
      return this.http.post<ResultDto<boolean>>(this.baseUrl + "AddStock", opModel).pipe(
        map((result: ResultDto<boolean>) => {
          if (result.isSuccess) {
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
    // Put
 
    // Delete

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
