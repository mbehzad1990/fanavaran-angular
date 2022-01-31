import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
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
  displayedColumns: string[] = ['index', 'name', 'count', 'price', 'amount', 'unitName', 'desc', 'delete'];

  isLoading$!: Observable<boolean>;

  isLoading = false;
  isOpen = false;

  _operationComplete:boolean=false;
  //#endregion

  //#region Input & OutPut & Other
  @Input() headerInfo!: RegisterStockOperationVm;
  @Input() headerInfoDto!: HeaderInfoDto;
  @Input() stepper!: MatStepper;
  @Output() OperationComplete=new EventEmitter<boolean>();

  //#endregion
  constructor(private _coreService: FacadService) {
    this.isLoading$ = this._coreService.Operation.isLoading$;
  }


  ngOnInit(): void {
  }

  getItem(_item: GoodDetailDto) {
    debugger
    let isExist = false;
    this.listOfGood.forEach(item => {
      if (item.goodName == _item.goodName) {
        isExist = true;
      }
    })
    if (!isExist) {
      this.listOfGood.push(_item);
      this.dataSource.data = this.listOfGood;
    } else {
      this._coreService.notification.showNotiffication(NotificationType.Warning, 'نام کالا تکراری است');
    }
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
    debugger
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
        this._operationComplete=true;
      }
    })

    this.subscriptions.push(sb);

  }
  getTotalCost() {
    return this.dataSource.data.map(t => t.amount).reduce((acc, value) => acc + value, 0).toString();
  }
  getTotalFi() {
    return this.dataSource.data.map(t => t.price).reduce((acc, value) => acc + value, 0).toString();
  }
  getTotalCount() {
    return this.dataSource.data.map(t => t.count).reduce((acc, value) => parseInt(acc.toString()) + parseInt(value.toString()), 0);
  }
  newOperation(){
    this.listOfGood=[];
    this.dataSource.data=[];
    this.OperationComplete.emit(this._operationComplete);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
