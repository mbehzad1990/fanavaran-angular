import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { HeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/header-info-dto';
import { RetrnHeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/retrn-header-info-dto';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import * as moment from 'jalali-moment';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-return-remittance-details',
  templateUrl: './return-remittance-details.component.html',
  styleUrls: ['./return-remittance-details.component.scss']
})
export class ReturnRemittanceDetailsComponent implements OnInit {

  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  isLoading$!: Observable<boolean>;
  dataSource = new MatTableDataSource<CustomerFactorGoodsVm>([]);
  displayedColumns: string[] = ['index', 'goodId', 'bacthNumber', 'expireDate', 'count', 'price', 'amount', 'description', 'menu'];
  currentRow = -1;
  isEditable:boolean=false;

  goodId!:number;
  //#endregion

  //#region Input & OutPut & Other
  @Input() headerInfoDto!: RetrnHeaderInfoDto;
  @Input() remittanceDetail!: CustomerFactorGoodsVm[];
  //#endregion
  constructor(private _coreService: FacadService) { }

  ngOnInit(): void {
    this.getData();
  }

  getTotalCost() {
    return this.dataSource.data.map(t => t.amount).reduce((acc, value) => acc + value, 0).toString();
  }
  getTotalFi() {
    return this.dataSource.data.map(t => t.price).reduce((acc, value) => acc * value, 0).toString();
  }
  getTotalCount() {
    return this.dataSource.data.map(t => t.count).reduce((acc, value) => parseInt(acc.toString()) + parseInt(value.toString()), 0);
  }
  getShamsi(strDate: Date): string {
    let MomentDate = moment(strDate, 'YYYY/MM/DD');;
    return MomentDate.locale('fa').format('YYYY/M/D');
  }
  getData() {
    const sb = this._coreService.Operation.remittanceDetails$.subscribe(data => {
      this.dataSource.data = data;
    });
  }
  changeFi(count:number,fi:number){
    let ss=count* fi;
    return ss.toString();
  }
  calculateAmount(){
    
  }
  isEditStateActive(row:CustomerFactorGoodsVm){
    this.goodId=row.goodId;
    console.log(this.isEditable)

  }


}
