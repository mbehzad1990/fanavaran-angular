import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, of, shareReplay, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { ItemRemainBatchVm } from 'src/shared/Domain/ViewModels/_report/item-remain-batch-vm';
import { ItemSalesBatchVm } from 'src/shared/Domain/ViewModels/_report/item-sales-batch-vm';
import { FacadService } from '../_Core/facad.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  //#region private
  private apiVersion = '1';
  private baseUrl = environment.serverUrl + `/api/v${this.apiVersion}/KobelReport/`;
  private _unsubscribe: Subscription[] = [];

  private _itemsRemain$ = new BehaviorSubject<ItemRemainBatchVm[]>([]);
  private _itemsSaleBatch$ = new BehaviorSubject<ItemSalesBatchVm[]>([]);
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
  get itemsRemain$() {
    return this._itemsRemain$.asObservable();
  }
  get ItemSalesBatch$() {
    return this._itemsSaleBatch$.asObservable();
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
  constructor(private http: HttpClient, private _coreService: FacadService) { }

  //#region GET
  getItemsRemainBatch(from: string, to: string) {
    this._isLoading$.next(true);
    const httpOptions = {
      headers: new HttpHeaders({
        'user': 'kobel',
        'pass': 'k0bel@DarO'
      })
    };
    // let headers = new HttpHeaders()
    // headers.append('user',"admin");
    // headers.append('pass',"admin1369")
    // console.log(headers);
    return this.http.get<ResultDto<ItemRemainBatchVm[]>>(this.baseUrl + `GetRemainBatch?from=${from}&&to=${to}`, httpOptions)
      .pipe(
        map((result: ResultDto<ItemRemainBatchVm[]>) => {
          if (result.isSuccess) {
            this._itemsRemain$.next(result.data);
          }
          return result.resultAction;
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
  }

  getItemsSaleBatch(from: string, to: string) {
    this._isLoading$.next(true);
    const httpOptions = {
      headers: new HttpHeaders({
        // 'user': 'kobel',
        // 'pass': 'k0bel@DarO'
        'user': 'admin',
        'pass': 'admin1369'
      })
    };
    // let headers = new HttpHeaders()
    // headers.append('user',"k0bel@DarO");
    // headers.append('pass',"k0bel@DarO")
    // console.log(headers);
    return this.http.get<ResultDto<ItemSalesBatchVm[]>>(this.baseUrl + `GetItemSaleBatch?from=${from}&&to=${to}`, httpOptions)
      .pipe(
        map((result: ResultDto<ItemSalesBatchVm[]>) => {
          if (result.isSuccess) {
            this._itemsSaleBatch$.next(result.data);
          }
          return result.resultAction;
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
  }
  //#endregion

  //#region POST
  //#endregion

  //#region PUT
  //#endregion

  //#region DELETE
  //#endregion
}
