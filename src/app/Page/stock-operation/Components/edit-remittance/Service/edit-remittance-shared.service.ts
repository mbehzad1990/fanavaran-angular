import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReportOperationDetailVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-detail-vm';
import { ReportOperationVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-vm';

@Injectable({
  providedIn: 'root'
})
export class EditRemittanceSharedService {
  private _showComponents = new BehaviorSubject<boolean>(false);
  private _remittanceDefualtData = new BehaviorSubject<ReportOperationVm>(null!);
  private _editItem = new BehaviorSubject<ReportOperationDetailVm>(null!);
  private _errorMessage = new BehaviorSubject<string>('');
  //#endregion

  //#region public
  //#endregion

  //#region Getter
  get showComponents$() {
    return this._showComponents.asObservable();
  }
  get editItem$() {
    return this._editItem.asObservable();
  }
  get remittanceDefualtData$() {
    return this._remittanceDefualtData.asObservable();
  }
  constructor() { }

  setShowComponentsState(flag:boolean){
    this._showComponents.next(flag);
  }
  setRemittanceDefualtData(data:ReportOperationVm){
    this._remittanceDefualtData.next(data);
  }
  setItemForEdit(item:ReportOperationDetailVm){
    this._editItem.next(item);
  }
  setDefualtItemForEdit(){
    this._editItem.next(null!);
  }
  
}
