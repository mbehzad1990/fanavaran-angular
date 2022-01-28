import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';
import { RegisterStokVm } from 'src/shared/Domain/ViewModels/Stock/register-stok-vm';
import { FacadService } from '../_Core/facad.service';

@Injectable({
  providedIn: 'root'
})
export class StockService implements OnDestroy {
  //#region private
  private apiVersion = '1';
  private baseUrl = `api/v${this.apiVersion}/Stock/`;
  private _unsubscribe: Subscription[] = [];

  private _stock$ = new BehaviorSubject<Stock[]>([]);
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
  get stock$() {
    return this._stock$.asObservable();
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
    if (this._stock$.value.length == 0 || this._stock$.getValue.length == 0) {
      this.getStocks();
    }
  }

  // Get
  getStocks() {
    this._isLoading$.next(true);
    const sb = this.http.get<ResultDto<Stock[]>>(this.baseUrl + "GettAllStocks")
      .pipe(
        map((result: ResultDto<Stock[]>) => {
          if (result.data) {
            this._stock$.next(result.data);
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
  // Post
  addStock(model: RegisterStokVm) {
    this._isLoading$.next(true);
    return this.http.post<ResultDto<boolean>>(this.baseUrl + "AddStock", model).pipe(
      map((result: ResultDto<boolean>) => {
        if (result.isSuccess) {
          this.getStocks();
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
  editStock(model: Stock) {
    this._isLoading$.next(true);
    return this.http.put<ResultDto<boolean>>(this.baseUrl + "EditStock", model).pipe(
      map((result: ResultDto<boolean>) => {
        if (result.isSuccess) {
          this.getStocks();
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
  // Delete
  deleteStock(stockId: number) {
    this._isLoading$.next(true);
    return this.http.delete<ResultDto<boolean>>(this.baseUrl + `DeleteStock?Id=${stockId}`).pipe(
      map((result: ResultDto<boolean>) => {
        if (result.isSuccess) {
          this.getStocks();
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
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
