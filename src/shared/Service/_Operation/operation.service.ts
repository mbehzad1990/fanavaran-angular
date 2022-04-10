import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType, StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { CustomerFactorDetailsVm } from 'src/shared/Domain/ViewModels/_Customer/customer-factor-details-vm';
import { GoodCardexVM } from 'src/shared/Domain/ViewModels/_Operation/good-cardex-vm';
import { RegisterOperationVm } from 'src/shared/Domain/ViewModels/_Operation/register-operation-vm';
import { ReportGoodsInStockVm } from 'src/shared/Domain/ViewModels/_Operation/report-goods-in-stock-vm';
import { ReportOperationDetailVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-detail-vm';
import { ReportOperationVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-vm';
import { UpdateOperationVm } from 'src/shared/Domain/ViewModels/_Operation/update-operation-vm';
import { UpdateRemittanceManuelIdVm } from 'src/shared/Domain/ViewModels/_StockOperation/update-remittance-manuel-id-vm';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import { FacadService } from '../_Core/facad.service';

@Injectable({
  providedIn: 'root'
})
export class OperationService implements OnDestroy {
  //#region private
  private apiVersion = '1';
  private baseUrl = environment.serverUrl + `/api/v${this.apiVersion}/Operation/`;
  private _unsubscribe: Subscription[] = [];

  private _operationlist$ = new BehaviorSubject<ReportOperationVm[]>([]);
  private _remittanceDetails = new BehaviorSubject<CustomerFactorGoodsVm[]>([]);
  private _operationDetailList$ = new BehaviorSubject<ReportOperationDetailVm[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isModalLoading$ = new BehaviorSubject<boolean>(false);
  private _isoperationDetailListLoading$ = new BehaviorSubject<boolean>(false);
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
  get isModalLoading$() {
    return this._isModalLoading$.asObservable();
  }
  get remittanceDetails$() {
    return this._remittanceDetails.asObservable();
  }
  get isoperationDetailListLoading$() {
    return this._isoperationDetailListLoading$.asObservable();
  }
  get operationlist$() {
    return this._operationlist$.asObservable();
  }
  get operationDetailList$() {
    return this._operationDetailList$.asObservable();
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



  //#region Get
  ListOfOperation() {
    this._isLoading$.next(true);
    return this.http.get<ResultDto<ReportOperationVm[]>>(this.baseUrl + "ListOfOperation").pipe(
      map((result: ResultDto<ReportOperationVm[]>) => {
        if (result.isSuccess) {
          this._operationlist$.next(result.data);
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
  CheckRemittanceMAnuelId(manuelId:string,regDate:string) {
    this._isModalLoading$.next(true);
    return this.http.get<ResultDto<boolean>>(this.baseUrl + `CheckRemittanceMAnuelId?manuelId=${manuelId}&registerDate=${regDate}`).pipe(
      map((result: ResultDto<boolean>) => {
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
        this._isModalLoading$.next(false);
        this._isCompleteStep$.next({ searc: true });
      }),
      shareReplay()
    );
  }
  GetListOfOperationDetails(opId: number) {
    this._isoperationDetailListLoading$.next(true);
    return this.http.get<ResultDto<ReportOperationDetailVm[]>>(this.baseUrl + `GetListOfOperationDetails?operationId=${opId}`).pipe(
      map((result: ResultDto<ReportOperationDetailVm[]>) => {
        if (result.isSuccess) {
          this._operationDetailList$.next(result.data);
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
        this._isoperationDetailListLoading$.next(false);
        this._isCompleteStep$.next({ searc: true });
      }),
      shareReplay()
    );
  }
  GetGoodsInStock(stockId: number): Observable<any> {
    this._isLoading$.next(true);
    return this.http.get<ResultDto<ReportGoodsInStockVm[]>>(this.baseUrl + `GetGoodInStock?stockId=${stockId}`).pipe(
      map((result: ResultDto<ReportGoodsInStockVm[]>) => {
        // if (result.isSuccess) {
        //   this._operationDetailList$.next(result.data);
        // }

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

  GetGoodCardex(stockId: number, goodId: number): Observable<any> {
    this._isLoading$.next(true);
    return this.http.get<ResultDto<GoodCardexVM[]>>(this.baseUrl + `GetGoodCardex?stockId=${stockId}&&goodId=${goodId}`).pipe(
      map((result: ResultDto<GoodCardexVM[]>) => {
        // if (result.isSuccess) {
        //   this._operationDetailList$.next(result.data);
        // }

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
  GetCustomerFactorDetails(customerId: number, stockOperationType: StockOperationType): Observable<any> {
    this._isLoading$.next(true);
    return this.http.get<ResultDto<CustomerFactorDetailsVm[]>>(this.baseUrl + `GetCustomerFactorDetails?CustomerId=${customerId}&StockOperationType=${stockOperationType}`).pipe(
      map((result: ResultDto<CustomerFactorDetailsVm[]>) => {
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
  //#endregion

  //#region Post
  RegisterOperation(opModel: RegisterOperationVm) {
    this._isLoading$.next(true);
    return this.http.post<ResultDto<boolean>>(this.baseUrl + "RegisterOperation", opModel).pipe(
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

  //#endregion
  
  //#region Put
  update(updateModel:UpdateOperationVm){
    this._isLoading$.next(true);
    return this.http.put<ResultDto<boolean>>(this.baseUrl+'UpdateOperation',updateModel).pipe(
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
  UpdateOperationManuelId(updateModel:UpdateRemittanceManuelIdVm){
    this._isLoading$.next(true);
    return this.http.put<ResultDto<boolean>>(this.baseUrl+'UpdateOperationManuelId',updateModel).pipe(
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
  //#endregion

  // Delete
  delete(spId: number) {
    this._isLoading$.next(true);
    return this.http.delete<ResultDto<boolean>>(this.baseUrl + `DeleteOperation?spId=${spId}`).pipe(
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

  //#region Other
  setRemittanceDetails(details: CustomerFactorGoodsVm[]) {
    this._remittanceDetails.next(details);
  }
  //#endregion  

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
