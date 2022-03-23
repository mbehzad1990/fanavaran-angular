import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import * as moment from 'jalali-moment';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { ReportOperationDetailVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-detail-vm';
import { EditRemittanceSharedService } from '../../Service/edit-remittance-shared.service';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';


@Component({
  selector: 'app-remittance-table-element',
  templateUrl: './remittance-table-element.component.html',
  styleUrls: ['./remittance-table-element.component.scss']
})
export class RemittanceTableElementComponent implements OnInit, OnDestroy {

  //#region Private field
  private subscriptions: Subscription[] = [];
  private _itemSelected!: ReportOperationDetailVm;
  private _listFData: ReportOperationDetailVm[] = [];

  //#endregion

  //#region Public field
  _operationComplete: boolean = true;

  isLoading$!: Observable<boolean>;
  dataSource = new MatTableDataSource<ReportOperationDetailVm>([]);
  displayedColumns: string[] = ['index', 'goodId', 'goodName', 'unitName', 'bacthNumber', 'expireDate', 'count', 'price', 'amount', 'menu'];


  //#endregion

  //#region Input & OutPut & Other
  @Output() editItem = new EventEmitter<ReportOperationDetailVm>();
  //#endregion
  constructor(private _coreService: FacadService, private _localService: EditRemittanceSharedService) {
    const sb = this._localService.remittanceDefualtData$.subscribe(data => {
      if (data) {
        this.fetchData(data.id);
      }
    });
    this.subscriptions.push(sb);
    this.isLoading$ = this._coreService.Operation.isLoading$;
  }

  ngOnInit(): void {

    this.getData();
  }


  //#region Public Methods
  getTotalCost() {
    return this.dataSource.data.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }
  getTotalFi() {
    return this.dataSource.data.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }
  getTotalCount() {
    return this.dataSource.data.map(t => t.count).reduce((acc, value) => parseInt(acc.toString()) + parseInt(value.toString()), 0);
  }
  getShamsi(strDate: Date | null): string {
    if (strDate != null) {
      let MomentDate = moment(strDate, 'YYYY/MM/DD');
      return MomentDate.locale('fa').format('YYYY/M/D');
    }
    return '';
  }
  edit(item: ReportOperationDetailVm) {
    this._itemSelected = item;
    this.editItem.emit(item);
    // this._localService.setItemForEdit(item);
  }
  updateTableDataSource(isEditMode: boolean, itemEdited: ReportOperationDetailVm) {

    if (this.dataSource.data.filter(p => p.goodId == itemEdited.goodId).length != 0) {
      this.dataSource.data.forEach(item => {
        if (!isEditMode) {
          if (item.price != itemEdited.price) {
            this._coreService.notification.showNotiffication(NotificationType.Warning, 'قیمت واحد را بررسی کنید');
          } else {
            item.count = parseInt(item.count.toString()) + parseInt(itemEdited.count.toString());
            item.amount = item.amount + itemEdited.amount;
          }
        } else {
          if (item.goodId == this._itemSelected.goodId) {
            this.deletItemFromList(this._itemSelected);
            item.amount = itemEdited.amount;
            item.bacthNumber = itemEdited.bacthNumber;
            item.count = itemEdited.count;
            item.description = itemEdited.description;
            item.expireDate = itemEdited.expireDate
            item.goodId = itemEdited.goodId;
            item.goodName = itemEdited.goodName;
            item.price = itemEdited.price;
            item.unitName = itemEdited.unitName;
          }
        }
      })
    }
    else {
      if (this.dataSource.data.filter(p => p.goodId == this._itemSelected.goodId).length != 0) {
        this.deletItemFromList(this._itemSelected);
      }
      this._listFData.push(itemEdited);
      this.dataSource.data = this._listFData;
    }
  }
  //#endregion

  //#region Private Methods
  private fetchData(opId: number) {
    const sb = this._coreService.Operation.GetListOfOperationDetails(opId).subscribe();
    this.subscriptions.push(sb);
  }
  private getData() {
    const sb = this._coreService.Operation.operationDetailList$.subscribe(data => {
      // if (data.length > 0) {
      //   data.forEach(item => {
      //     const good = new GoodOfRemittanceDto();
      //     good.goodId = item.goodId;
      //     good.name = item.goodName
      //     good.bacthNumber = item.bacthNumber;
      //     good.count = item.count;
      //     if (good.expireDate != null) {
      //       good.expireDate = item.expireDate!;
      //     }
      //     good.price = item.price;
      //     good.amount = item.amount;

      //     this.goodOfRemittance.push(good);
      //   })
      // }
      this._listFData = data;
      this.dataSource.data = data;
    });
    // this.listOfGoodIsOK = true;
    // this.filterGoods.next(this.goodOfRemittance.slice());
    this.subscriptions.push(sb);
  }
  deletItemFromList(deleteItem: ReportOperationDetailVm) {
    const data = this.dataSource.data;
    const index: number = data.indexOf(deleteItem);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;
      this._listFData = [];
      this._listFData = this.dataSource.data;

    }
  }
  //#endregion
  ngOnDestroy(): void {
    this.subscriptions.forEach(sp => sp.unsubscribe());
  }
}
