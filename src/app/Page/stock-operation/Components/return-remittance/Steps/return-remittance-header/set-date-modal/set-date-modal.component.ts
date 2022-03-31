import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import * as moment from 'jalali-moment';
import { MatStep } from '@angular/material/stepper';
import { ReturnHeaderDto } from 'src/shared/Domain/Dto/_Operation/ReturnRemittance/return-header-dto';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { ReturnShareDataService } from '../../Service/return-share-data.service';


@Component({
  selector: 'app-set-date-modal',
  templateUrl: './set-date-modal.component.html',
  styleUrls: ['./set-date-modal.component.scss']
})
export class SetDateModalComponent implements OnInit {

  //#region Private
  private subscriptions: Subscription[] = [];

  //#endregion

  //#region Public
  dateSelected:string='';
  form!: FormGroup;
  isFinishOperation!: boolean;
  operationResultApi!: ResultDto<boolean>;
  
  //#endregion

  //#region Input & Output & Others
  //#endregion
  constructor(private _shareData: ReturnShareDataService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SetDateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReturnHeaderDto) { }

  ngOnInit(): void {
    this.formElementInit();
  }

  formElementInit() {
    this.form = this.fb.group({
      datePicker: ['', Validators.required],
      description:['']
    });
  }
  onChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.dateSelected =moment(event.value?.toISOString()).add(1,'day').format("jYYYY/jMM/jDD");
  }
  done(des:string){
    const model=new RegisterStockOperationVm();
    model.personId=this.data.personId;
    model.refId=this.data.refId;
    model.stockId=this.data.stockId;
    model.stockOperationType=this.data.stockOperationType;
    model.registerDate=new Date(moment.from( this.dateSelected, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
    model.description=des;

    this._shareData.setReturnHeaders(model);
    this.dialogRef.close(true);
  }
}
