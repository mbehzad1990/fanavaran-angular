import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, finalize, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { DeleteGoodVm } from 'src/shared/Domain/ViewModels/_Good/delete-good-vm';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import { RegisterGoodVm } from 'src/shared/Domain/ViewModels/_Good/register-good-vm';
import { UpdateGoodVm } from 'src/shared/Domain/ViewModels/_Good/update-good-vm';
import { FacadService } from '../_Core/facad.service';

@Injectable({
  providedIn: 'root'
})
export class GoodService implements OnDestroy {
  //#region private
  private apiVersion = '1';
  private baseUrl = environment.serverUrl + `/api/v${this.apiVersion}/Good/`;
  private _unsubscribe: Subscription[] = [];

  private _items$ = new BehaviorSubject<GoodDetailsVm[]>([]);
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
    const sb = this.http.get<ResultDto<GoodDetailsVm[]>>(this.baseUrl + "GetAll")
      .pipe(
        map((result: ResultDto<GoodDetailsVm[]>) => {
          if (result.data) {
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
  findGoodInRemittance(goodId: number) {
    this._isLoading$.next(true);
    return this.http.get<ResultDto<boolean>>(this.baseUrl + `FindGoodInRemittance?goodId=${goodId}`)
      .pipe(
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
          this._isLoading$.next(false);
          this._isCompleteStep$.next({ searc: true });
        }),
        shareReplay()
      )
  }
  //#endregion

  //#region Post
  add(model: RegisterGoodVm) {
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
  addlist(model: RegisterGoodVm[]) {
    this._isLoading$.next(true);
    return this.http.post<ResultDto<boolean>>(this.baseUrl + "AddList", model).pipe(
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
  edit(model: UpdateGoodVm) {
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
  delete(deleteModel: DeleteGoodVm) {
    this._isLoading$.next(true);
    return this.http.delete<ResultDto<boolean>>(this.baseUrl + `Delete?GoodId=${deleteModel.goodId}&ManualId=${deleteModel.manualId}`).pipe(
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
