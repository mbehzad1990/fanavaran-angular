import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { GoodDetailDto } from 'src/shared/Domain/Dto/_Good/good-detail-dto';
import { HeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/header-info-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { RegisterOperationVm } from 'src/shared/Domain/ViewModels/_Operation/register-operation-vm';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { GoodDetail } from 'src/shared/Domain/ViewModels/_stockOperationDetail/good-detail';
import { RegisterStockOperationDetail } from 'src/shared/Domain/ViewModels/_stockOperationDetail/register-stock-operation-detail';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { RemittanceHeaderComponent } from '../remittance-header/remittance-header.component';
import * as moment from 'jalali-moment';

@Component({
  selector: 'app-remittance-details',
  templateUrl: './remittance-details.component.html',
  styleUrls: ['./remittance-details.component.scss']
})
export class RemittanceDetailsComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  editrow = false;
  private numberChars = new RegExp("[^0-9]", "g")
  //#endregion

  //#region Public field
  // formType!:StockOperationType;
  listOfGood: GoodDetailDto[] = [];
  dataSource = new MatTableDataSource<GoodDetailDto>(this.listOfGood);
  displayedColumns: string[] = ['index', 'name', 'unitName', 'count', 'price', 'amount', 'batch', 'expirdate', 'desc', 'menu'];

  isLoading$!: Observable<boolean>;

  isLoading = false;
  isOpen = false;

  _operationComplete: boolean = true;
  currentRow = -1;
  //#endregion

  //#region Input & OutPut & Other
  @Input() headerInfo!: RegisterStockOperationVm;
  @Input() headerInfoDto!: HeaderInfoDto;
  @Input() stepper!: MatStepper;
  @Input() headerStep!: MatStep;
  @Output() OperationComplete = new EventEmitter<boolean>();

  //#endregion
  constructor(private _coreService: FacadService) {
    this.isLoading$ = this._coreService.Operation.isLoading$;
  }


  ngOnInit(): void {
  }
  // getShamsi(strDate: Date|null): string {
  //   if(strDate!=null){
  //     let MomentDate = moment(strDate, 'YYYY/MM/DD');
  //     return MomentDate.locale('fa').format('YYYY/M/D');
  //   }
  //   return '';
  // }
  getShamsi(strDate: string): string {
    return this._coreService.UtilityFunction.getShamsiString(strDate);
  }
  getItem(_item: GoodDetailDto) {
    // let isExist = false;
    // const indexItem = this.dataSource.data.findIndex(p => p.goodId == _item.goodId && p.bacthNumber?.trim() == _item.bacthNumber?.trim());
    // if (indexItem >= 0) {
    //   if (this.dataSource.data[indexItem].price != _item.price) {
    //     this._coreService.notification.showNotiffication(NotificationType.Warning, 'قیمت واحد را بررسی کنید');
    //   } else {
    //     this.dataSource.data[indexItem].count = parseInt(this.dataSource.data[indexItem].count.toString()) + parseInt(_item.count.toString());
    //     this.dataSource.data[indexItem].amount = this.dataSource.data[indexItem].count * this.dataSource.data[indexItem].price;
    //   }

    // } else {
    //   this.listOfGood.push(_item);
    //   this.dataSource.data = this.listOfGood;
    // }
    this.listOfGood.push(_item);
    this.dataSource.data = this.listOfGood;

  }
  deletItemFromList(deleteItem: GoodDetailDto) {
    const data = this.dataSource.data;
    const index: number = data.indexOf(deleteItem);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;

    }
  }
  addGoods() {
    if (this.dataSource.data.length > 0) {

      let model = new RegisterOperationVm();
      let detail = new RegisterStockOperationDetail();
      model.Header = this.headerInfo;

      let goodDetails: GoodDetail[] = [];
      this.dataSource.data.forEach(item => {
        const _goodItem = new GoodDetail();
        _goodItem.goodId = item.goodId;
        _goodItem.price = Number(item.price.toString().replace(this.numberChars, ""));
        _goodItem.count = item.count;
        _goodItem.Description = item.description;
        _goodItem.amount = Number(item.amount.toString().replace(this.numberChars, ""));
        _goodItem.bacthNumber = item.bacthNumber;
        _goodItem.expireDate = item.expireDate!;
        _goodItem.goodManuelId=item.goodManuelId;
        

        goodDetails.push(_goodItem);
      })
      detail.goodDetails = goodDetails;
      model.Detail = detail;

      const sb = this._coreService.Operation.RegisterOperation(model).subscribe(result => {
        if (result?.isSuccess) {
          this._coreService.notification.showNotiffication(
            NotificationType.Success,
            'حواله جدید ثبت شد'
          );
          this._operationComplete = false;
        }
      })

      this.subscriptions.push(sb);
    } else {
      this._coreService.notification.showNotiffication(
        NotificationType.Warning,
        'کالایی جهت ثبت وارد نشده است'
      );
    }

  }
  getTotalCost() {
    return this.dataSource.data.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }
  getTotalFi() {
    return this.dataSource.data.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }
  getTotalCount() {
    return this.dataSource.data.map(t => t.count).reduce((acc, value) => parseInt(acc.toString()) + parseInt(value.toString()), 0);
  }
  newOperation() {
    this.listOfGood = [];
    this.dataSource.data = [];
    this.headerInfoDto = new HeaderInfoDto();
    this.OperationComplete.emit(this._operationComplete);
    this._operationComplete = false;
  }
  buttonStatus(): boolean {
    if (this.dataSource.data.length > 0 && this._operationComplete) {
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
