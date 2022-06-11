import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import * as moment from 'jalali-moment';

import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { ItemSaleBatchTableComponent } from './item-sale-batch-table/item-sale-batch-table.component';
import { ResultAction } from 'src/shared/Domain/Enums/global-enums';

@Component({
  selector: 'app-item-sale-batch',
  templateUrl: './item-sale-batch.component.html',
  styleUrls: ['./item-sale-batch.component.scss']
})
export class ItemSaleBatchComponent implements OnInit,OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  private toDate:string="";
  private fromDate:string="";
  //#endregion

  //#region Public field
  frmReport!:FormGroup;
  //#endregion

  //#region Input & OutPut & Other
  @ViewChild('dataTable') dataTable!:ItemSaleBatchTableComponent;
  //#endregion
  constructor(private fb:FormBuilder,private _coreService:FacadService) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.formElementInit();

  }

  formElementInit(){
    this.frmReport=this.fb.group(
      {
        from: [''],
        to: [''],
      }
    );
  }
  fromDateOnChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.fromDate = moment(event.value?.toISOString()).format("jYYYY/jMM/jDD");
  }
  toDateOnChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.toDate = moment(event.value?.toISOString()).format("jYYYY/jMM/jDD");
  }
  getData(){
    //بررسی وارد کردن تاریخ
    const _toDate=this._coreService.UtilityFunction.convertShamsiStringDateToMiladiStringDate(this.toDate);
    const _fromDate=this._coreService.UtilityFunction.convertShamsiStringDateToMiladiStringDate(this.fromDate);
    this.fetchData(_toDate,_fromDate);

  }

 private fetchData(toDate: string, fromDate: string) {
    const sb = this._coreService.report.getItemsSaleBatch(fromDate, toDate).subscribe(result => {
      if(result==ResultAction.Success){
        this.dataTable.setDataIntoTable();
      }
    });
    this.subscriptions.push(sb);
  }

}
