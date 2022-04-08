import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import * as moment from 'jalali-moment';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { ReportOperationDetailVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-detail-vm';
import { EditRemittanceSharedService } from '../../Service/edit-remittance-shared.service';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { GoodDetail } from 'src/shared/Domain/ViewModels/_stockOperationDetail/good-detail';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


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
  private numberChars = new RegExp("[^0-9]", "g")

  //#endregion

  //#region Public field
  _operationComplete: boolean = true;

  isLoading$!: Observable<boolean>;
  dataSource = new MatTableDataSource<ReportOperationDetailVm>([]);
  displayedColumns: string[] = ['index', 'goodId', 'goodName', 'unitName', 'bacthNumber', 'expireDate', 'count', 'price', 'amount', 'menu'];


  //#endregion

  //#region Input & OutPut & Other
  @Output() editItem = new EventEmitter<ReportOperationDetailVm[]>();
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
  getShamsi(strDate: string): string {
    return this._coreService.UtilityFunction.getShamsiString(strDate);
  }
  edit(item: ReportOperationDetailVm) {
    var itemExport: ReportOperationDetailVm[] = [];
    const index = this.dataSource.data.indexOf(item);
    item.index = index;
    itemExport.push(item);
    this._itemSelected = item;
    this.editItem.emit(itemExport);
    // this._localService.setItemForEdit(item);
  }
  updateTableDataSource(itemEdited: ReportOperationDetailVm[]) {
    //itemEdited[0] ==> current 
    const s = 1;
    if (itemEdited.length == 1) {
      // New Item
      if (this.dataSource.data.filter(p => p.goodId == itemEdited[0].goodId && p.bacthNumber?.trim() == itemEdited[0].bacthNumber?.trim()).length != 0) {
        this._coreService.notification.showNotiffication(NotificationType.Warning, 'این کالا قبلا در لیست اضافه شده است');
        // for (let index = 0; index < this.dataSource.data.length; index++) {
        //   const itemSelected=this.dataSource.data[index];
        //   const itemEditedSelected=itemEdited[0];
        //   if(itemSelected.goodId==itemEditedSelected.goodId && itemSelected.bacthNumber?.trim()==itemEditedSelected.bacthNumber?.trim()){
        //   }else{
        //     this._listFData.push(itemEdited[0]);
        //     this.dataSource.data = this._listFData;
        //   }

        // }
        // this.dataSource.data.forEach(item => {
        //   if (item.goodId == itemEdited[0].goodId && item.bacthNumber==itemEdited[0].bacthNumber) {
        //     if (item.price != itemEdited[0].price) {
        //       this._coreService.notification.showNotiffication(NotificationType.Warning, 'قیمت واحد را بررسی کنید');
        //     } else {
        //         item.count = parseInt(item.count.toString()) + parseInt(itemEdited[0].count.toString());
        //         item.amount = item.amount + itemEdited[0].amount;
        //         item.bacthNumber = itemEdited[0].bacthNumber;
        //         item.description = itemEdited[0].description;
        //         item.expireDate = itemEdited[0].expireDate
        //         item.goodId = itemEdited[0].goodId;
        //         item.goodName = itemEdited[0].goodName;
        //         item.price = itemEdited[0].price;
        //         item.unitName = itemEdited[0].unitName;
        //     }
        //   }else{
        //     this._listFData.push(itemEdited[0]);
        //     this.dataSource.data = this._listFData;
        //   }
        // })
      } else {
        // this.dataSource.data=[];
        this._listFData.push(itemEdited[0]);
        this.dataSource.data = this._listFData;
      }
    } else {
      // Edit Item
      if (itemEdited[0].goodId == itemEdited[1].goodId) {
        // const index=this.dataSource.data.findIndex(p=>p.goodId==itemEdited[1].goodId && p.bacthNumber?.trim()==itemEdited[1].bacthNumber?.trim());

        this.dataSource.data[itemEdited[0].index].amount = itemEdited[1].amount;
        this.dataSource.data[itemEdited[0].index].bacthNumber = itemEdited[1].bacthNumber;
        this.dataSource.data[itemEdited[0].index].count = itemEdited[1].count;
        this.dataSource.data[itemEdited[0].index].description = itemEdited[1].description;
        this.dataSource.data[itemEdited[0].index].expireDate = itemEdited[1].expireDate
        this.dataSource.data[itemEdited[0].index].goodId = itemEdited[1].goodId;
        this.dataSource.data[itemEdited[0].index].goodName = itemEdited[1].goodName;
        this.dataSource.data[itemEdited[0].index].price = itemEdited[1].price;
        this.dataSource.data[itemEdited[0].index].unitName = itemEdited[1].unitName;
        // if(itemEdited[0].bacthNumber?.trim()!=''){
        //   this.dataSource.data.forEach(item => {
        //     if (item.goodId == itemEdited[1].goodId && item.bacthNumber?.trim()==itemEdited[1].bacthNumber?.trim()) {
        //       item.amount = itemEdited[1].amount;
        //       item.bacthNumber = itemEdited[1].bacthNumber;
        //       item.count = itemEdited[1].count;
        //       item.description = itemEdited[1].description;
        //       item.expireDate = itemEdited[1].expireDate
        //       item.goodId = itemEdited[1].goodId;
        //       item.goodName = itemEdited[1].goodName;
        //       item.price = itemEdited[1].price;
        //       item.unitName = itemEdited[1].unitName;
        //     }
        //   })
        // }else{
        //   this.dataSource.data.forEach(item => {
        //     if (item.goodId == itemEdited[1].goodId ) {
        //       item.amount = itemEdited[1].amount;
        //       item.bacthNumber = itemEdited[1].bacthNumber;
        //       item.count = itemEdited[1].count;
        //       item.description = itemEdited[1].description;
        //       item.expireDate = itemEdited[1].expireDate
        //       item.goodId = itemEdited[1].goodId;
        //       item.goodName = itemEdited[1].goodName;
        //       item.price = itemEdited[1].price;
        //       item.unitName = itemEdited[1].unitName;
        //     }
        //   })
        // }

      } else {
        this.deletItemFromList(itemEdited[0]);
        this._listFData.push(itemEdited[1]);
        this.dataSource.data = this._listFData;
      }
    }
  }
  delete(item: ReportOperationDetailVm) {
    this.deletItemFromList(item);
  }
  prepareDataForDb(): GoodDetail[] {
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
      // var expDate=new Date(item.expireDate!.getFullYear(),item.expireDate!.getMonth(),item.expireDate!.getDay(),0,0,0,0);
      // _goodItem.expireDate = item.expireDate!.toString();

      goodDetails.push(_goodItem);
    })
    return goodDetails;
  }
  //#endregion

  //#region Private Methods
  private fetchData(opId: number) {
    const sb = this._coreService.Operation.GetListOfOperationDetails(opId).subscribe();
    this.subscriptions.push(sb);
  }
  private getData() {
    const sb = this._coreService.Operation.operationDetailList$.subscribe(data => {
      this._listFData = data;
      this.dataSource.data = data;
    });
    this.subscriptions.push(sb);
  }
  private deletItemFromList(deleteItem: ReportOperationDetailVm) {
    const data = this.dataSource.data;
    const index: number = data.indexOf(deleteItem);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;
      this._listFData = [];
      this._listFData = this.dataSource.data;

    }
  }
  private searchItemInDataSource(item: ReportOperationDetailVm): ReportOperationDetailVm {
    const itemSearch = this.dataSource.data.filter(c => c.goodId == item.goodId)[0];
    return itemSearch;
  }
  private getArrayOfDate(_date: Date): string[] {
    return moment.from(_date.toISOString(), 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD').split('/')
  }
  //#endregion
  ngOnDestroy(): void {
    this.subscriptions.forEach(sp => sp.unsubscribe());
  }
}
