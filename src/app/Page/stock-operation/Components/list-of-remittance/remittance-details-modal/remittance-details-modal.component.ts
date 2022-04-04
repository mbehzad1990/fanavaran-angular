import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ReportOperationDetailVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-detail-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import * as moment from 'jalali-moment';
@Component({
  selector: 'app-remittance-details-modal',
  templateUrl: './remittance-details-modal.component.html',
  styleUrls: ['./remittance-details-modal.component.scss']
})
export class RemittanceDetailsModalComponent implements OnInit, OnDestroy {

  //#region Pravait
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public
  listOfdetails: ReportOperationDetailVm[] = [];
  dataSource = new MatTableDataSource<ReportOperationDetailVm>();
  displayedColumns: string[] = ['index','goodId','manuelId','name','batch','exp', 'count', 'price', 'amount', 'unitName', 'desc',];

  isLoading$!: Observable<boolean>;
  //#endregion

  //#region Input & Output & Others
  //#endregion

  constructor(
    private _coreService: FacadService,
    public dialogRef: MatDialogRef<RemittanceDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestModalDto<number>) {
      this.isLoading$=this._coreService.Operation.isoperationDetailListLoading$;
     }
     
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  ngOnInit(): void {
    this.fetchData();
    this.getData();
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

  fetchData() {
    const sb = this._coreService.Operation.GetListOfOperationDetails(this.data.data).subscribe();
    this.subscriptions.push(sb);
  }
  getData() {
    const sb = this._coreService.Operation.operationDetailList$.subscribe(data => {
      debugger
      this.dataSource.data = data;
    });
  }

  getShamsi(strDate: Date|null): string {
    if(strDate!=null){
      let MomentDate = moment(strDate, 'YYYY/MM/DD');
      return MomentDate.locale('fa').format('YYYY/M/D');
    }
    return '';
  }

}
