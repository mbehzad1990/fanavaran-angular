import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import * as moment from 'jalali-moment';
import { MatStep } from '@angular/material/stepper';
import { ReturnHeaderDto } from 'src/shared/Domain/Dto/_Operation/ReturnRemittance/return-header-dto';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { ReturnShareDataService } from '../../Service/return-share-data.service';
import { ResultType } from 'src/shared/Domain/Enums/global-enums';


@Component({
  selector: 'app-set-date-modal',
  templateUrl: './set-date-modal.component.html',
  styleUrls: ['./set-date-modal.component.scss']
})
export class SetDateModalComponent implements OnInit,OnDestroy {

  //#region Private
  private subscriptions: Subscription[] = [];

  //#endregion

  //#region Public
  dateSelected:string='';
  form!: FormGroup;
  isFinishOperation!: boolean;
  operationResultApi!: ResultDto<boolean>;
  isLoading$!: Observable<boolean>;
  resultMessage: string = '';
  messageResultType!: ResultType;
  //#endregion

  //#region Input & Output & Others
  //#endregion
  constructor(private _shareData: ReturnShareDataService,private _coreService:FacadService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SetDateModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReturnHeaderDto) {
      this.isLoading$=this._coreService.Operation.isModalLoading$;
     }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }

  ngOnInit(): void {
    this.formElementInit();
  }

  formElementInit() {
    this.form = this.fb.group({
      datePicker: ['', Validators.required],
      manuelId: [null],
      description:['']
    });
  }
  onChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.dateSelected =moment(event.value?.toISOString()).format("jYYYY/jMM/jDD");
  }
  done(des:string){
    const model=new RegisterStockOperationVm();
    model.personId=this.data.personId;
    model.manuelId=this.form.value.manuelId;
    model.refId=this.data.refId;
    model.stockId=this.data.stockId;
    model.stockOperationType=this.data.stockOperationType;
    const _dateSelected=new Date(moment.from( this.dateSelected, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
    // this._headerInfo.registerDate=this._coreService.UtilityFunction.convertMiladiDateToString(_dateSelected);
    model.registerDate=this._coreService.UtilityFunction.convertMiladiDateToString(_dateSelected);
    model.description=des;
    const sb=this._coreService.Operation.CheckRemittanceMAnuelId(model.manuelId,model.registerDate).subscribe(result=>{
      if(result?.isSuccess){
        if(result.data){
          this._shareData.setReturnHeaders(model);
          this.dialogRef.close(true);
        }else{
          this.isFinishOperation = true;
          this.messageResultType = ResultType.error;
          this.resultMessage = this._coreService.errorHandler.getErrorText(result!.resultAction);
        }
      }
    })
    this.subscriptions.push(sb);
  }
}
