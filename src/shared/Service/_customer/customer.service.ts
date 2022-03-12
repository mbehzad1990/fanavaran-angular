import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { Customer } from 'src/shared/Domain/Models/_Customer/customer';
import { CustomerRegisterVm } from 'src/shared/Domain/ViewModels/Customer/customer-register-vm';
import { CustomerEditVm } from 'src/shared/Domain/ViewModels/_Customer/Customer-Edit-Vm';
import { FacadService } from '../_Core/facad.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy {
  //#region private
  private apiVersion = '1';
  private baseUrl = environment.serverUrl+ `/api/v${this.apiVersion}/Customer/`;
  private _unsubscribe: Subscription[] = [];

  private _items$ = new BehaviorSubject<Customer[]>([]);
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
  get items$() {
    return this._items$.asObservable();
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
    if (this._items$.value.length == 0 || this._items$.getValue.length == 0) {
      this.getAll();
    }
  }

  //#region Get
  getAll() {
    this._isLoading$.next(true);
    const sb = this.http.get<ResultDto<Customer[]>>(this.baseUrl + "GettAll")
      .pipe(
        map((result: ResultDto<Customer[]>) => {
          if (result.data) {
            debugger
            this._items$.next(result.data);
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
  //#endregion

  //#region Post
  add(model: CustomerRegisterVm) {
    this._isLoading$.next(true);
    return this.http.post<ResultDto<boolean>>(this.baseUrl + "Add", model).pipe(
      map((result: ResultDto<boolean>) => {
        if (result.isSuccess) {
          this.getAll();
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
  //#endregion

  //#region Put
  edit(model: CustomerEditVm) {
    debugger
    this._isLoading$.next(true);
    return this.http.put<ResultDto<boolean>>(this.baseUrl + "Edit", model).pipe(
      map((result: ResultDto<boolean>) => {
        if (result.isSuccess) {
          this.getAll();
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
  //#endregion

  //#region Delete
  delete(Id: number) {
    this._isLoading$.next(true);
    return this.http.delete<ResultDto<boolean>>(this.baseUrl + `Delete?Id=${Id}`).pipe(
      map((result: ResultDto<boolean>) => {
        if (result.isSuccess) {
          this.getAll();
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

  //#endregion


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
