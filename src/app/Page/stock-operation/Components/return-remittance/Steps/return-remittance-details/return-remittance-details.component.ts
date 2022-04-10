import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { HeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/header-info-dto';
import { RetrnHeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/retrn-header-info-dto';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import * as moment from 'jalali-moment';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import { GoodOfRemittanceDto } from 'src/shared/Domain/Dto/_Good/good-of-remittance-dto';
import { ReturnShareDataService } from '../Service/return-share-data.service';
import { GoodDetailDto } from 'src/shared/Domain/Dto/_Good/good-detail-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { RegisterOperationVm } from 'src/shared/Domain/ViewModels/_Operation/register-operation-vm';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { GoodDetail } from 'src/shared/Domain/ViewModels/_stockOperationDetail/good-detail';
import { RegisterStockOperationDetail } from 'src/shared/Domain/ViewModels/_stockOperationDetail/register-stock-operation-detail';
import { MatButton } from '@angular/material/button';
import { ReturnAddDetailsComponent } from './return-add-details/return-add-details.component';

@Component({
  selector: 'app-return-remittance-details',
  templateUrl: './return-remittance-details.component.html',
  styleUrls: ['./return-remittance-details.component.scss']
})
export class ReturnRemittanceDetailsComponent implements OnInit,OnDestroy {

  //#region Private field
  private subscriptions: Subscription[] = [];
  private _header!:RegisterStockOperationVm;
  private numberChars = new RegExp("[^0-9]", "g")
  private isEditItem:boolean=false;
  //#endregion

  //#region Public field
  isLoading$!: Observable<boolean>;
  listOfGood: GoodDetailDto[] = [];
  dataSource = new MatTableDataSource<GoodDetailDto>(this.listOfGood);
  displayedColumns: string[] = ['index', 'goodId','goodName', 'bacthNumber', 'expireDate', 'count', 'price', 'amount', 'description', 'menu'];
  currentRow = -1;
  isEditable:boolean=false;

  goodId!:number;
  
  _operationComplete:boolean=true;
  //#endregion

  //#region Input & OutPut & Other
  @Input() headerInfoDto!: RetrnHeaderInfoDto;
  @Input() remittanceDetail!: CustomerFactorGoodsVm[];
  @ViewChild('crudItem') crudItem!:ReturnAddDetailsComponent;
  //#endregion
  constructor(private _coreService: FacadService,private _shareData: ReturnShareDataService) { }


  ngOnInit(): void {
    this.getHeaderDetail();
  }

  getTotalCost() {
    const s=this.dataSource.data.map(t => t.amount).reduce((acc, value) => parseInt(acc.toString()) + parseInt(value.toString()), 0);
    return s;
  }
  getTotalFi() {
    return this.dataSource.data.map(t => t.price).reduce((acc, value) => parseInt(acc.toString()) + parseInt(value.toString()), 0);
  }
  getTotalCount() {
    return this.dataSource.data.map(t => t.count).reduce((acc, value) => parseInt(acc.toString()) + parseInt(value.toString()), 0);
  }

  getShamsi(strDate: string): string {
    return this._coreService.UtilityFunction.getShamsiString(strDate);
  }
  getItem(_item: GoodDetailDto) {
    let isExist = false;
    this.listOfGood.forEach(item => {
      if (item.goodName == _item.goodName) {
        isExist = true;
      }
    })
    if (!isExist) {
      this.listOfGood.push(_item);
      this.dataSource.data = this.listOfGood;
      // this.dataSource.data.push(_item);
    } else {
      this._coreService.notification.showNotiffication(NotificationType.Warning, 'نام کالا تکراری است');
    }
  }

  addGoods(btn:MatButton) {
    if(this.dataSource.data.length>0){

      let model = new RegisterOperationVm();
      let detail = new RegisterStockOperationDetail();
      model.Header = this._header;

      
      let goodDetails: GoodDetail[] = [];
      this.dataSource.data.forEach(item => {
        const _goodItem = new GoodDetail();
        _goodItem.goodId = item.goodId;
        _goodItem.price = Number(item.price.toString().replace(this.numberChars, ""));
        _goodItem.count = item.count;
        _goodItem.Description = item.description;
        _goodItem.amount = Number(item.amount.toString().replace(this.numberChars, ""));
        _goodItem.bacthNumber=item.bacthNumber;
        _goodItem.expireDate=item.expireDate!;
  
        goodDetails.push(_goodItem);
      })
      detail.goodDetails = goodDetails;
      model.Detail=detail;
  
      const sb = this._coreService.Operation.RegisterOperation(model).subscribe(result => {
        if (result?.isSuccess) {
          this._coreService.notification.showNotiffication(
            NotificationType.Success,
            'حواله جدید ثبت شد'
          );
          btn.disabled=true;
          this._operationComplete=false;
        }
      })
  
      this.subscriptions.push(sb);
    }else{
      this._coreService.notification.showNotiffication(
        NotificationType.Warning,
        'کالایی جهت ثبت وارد نشده است'
      );
    }

  }
  newOperation(){
    this._shareData.setCompletHeaderStep(false);
  }
  getHeaderDetail(){
    const sb=this._shareData.returnHeader$.subscribe(data=>{
      this._header=data;
    })
  }
  deletItemFromList(deleteItem: GoodDetailDto) {
    const data = this.dataSource.data;
    const index: number = data.indexOf(deleteItem);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;

    }
  }
  ngOnDestroy(): void {
    this._shareData.setCompletHeaderStep(false);
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }
}
