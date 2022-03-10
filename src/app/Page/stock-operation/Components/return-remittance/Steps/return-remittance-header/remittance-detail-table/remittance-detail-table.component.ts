import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import * as moment from 'jalali-moment';
import { MatStep } from '@angular/material/stepper';


@Component({
  selector: 'app-remittance-detail-table',
  templateUrl: './remittance-detail-table.component.html',
  styleUrls: ['./remittance-detail-table.component.scss']
})
export class RemittanceDetailTableComponent implements OnInit,OnDestroy {

  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  isLoading$!: Observable<boolean>;
  dataSource = new MatTableDataSource<CustomerFactorGoodsVm>([]);
  displayedColumns: string[] = [ 'index', 'goodId', 'bacthNumber', 'expireDate', 'count','price','amount','description'];

  //#endregion

  //#region Input & OutPut & Other
  @Input() data!: CustomerFactorGoodsVm[];
  @Input() nextStepper!: MatStep;
  //#endregion
  constructor() { }
  
  ngOnInit(): void {
    this.dataSource.data=this.data;
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
  getShamsi(strDate: Date): string {
    let MomentDate = moment(strDate, 'YYYY/MM/DD');;
    return MomentDate.locale('fa').format('YYYY/M/D');
   }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sp => sp.unsubscribe());
  }

}
