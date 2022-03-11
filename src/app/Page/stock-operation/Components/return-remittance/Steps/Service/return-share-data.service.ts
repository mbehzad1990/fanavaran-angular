import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';

@Injectable({
  providedIn: 'root'
})
export class ReturnShareDataService {
  private _returnHeader = new BehaviorSubject<RegisterStockOperationVm>(null!);
  private _returnGoodOfRemittance = new BehaviorSubject<CustomerFactorGoodsVm[]>([]);
  private _completeHeaderStep = new BehaviorSubject<boolean>(false);
  private _errorMessage = new BehaviorSubject<string>('');
  //#endregion

  //#region public
  //#endregion

  //#region Getter
  get returnHeader$() {
    return this._returnHeader.asObservable();
  }
  get completeHeaderStep$() {
    return this._completeHeaderStep.asObservable();
  }
  get returnGoodOfRemittance$() {
    return this._returnGoodOfRemittance.asObservable();
  }
  constructor() { }
  setReturnHeaders(model:RegisterStockOperationVm){
    this._returnHeader.next(model);
  }
  setGoodOfRemittance(goods:CustomerFactorGoodsVm[]){
    this._returnGoodOfRemittance.next(goods);
  }
  setCompletHeaderStep(flag:boolean){
    this._completeHeaderStep.next(flag);
  }
}
