import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { EditRemittanceManuelIdDto } from 'src/shared/Domain/Dto/_Operation/edit-remittance-manuel-id-dto';
import { NotificationType, ResultType } from 'src/shared/Domain/Enums/global-enums';
import { UpdateRemittanceManuelIdVm } from 'src/shared/Domain/ViewModels/_StockOperation/update-remittance-manuel-id-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-edit-remittance-manuel-id',
  templateUrl: './edit-remittance-manuel-id.component.html',
  styleUrls: ['./edit-remittance-manuel-id.component.scss']
})
export class EditRemittanceManuelIdComponent implements OnInit, OnDestroy {

  //#region Pravait
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public
  form!: FormGroup;
  isLoading$!: Observable<boolean>;
  operationData!:EditRemittanceManuelIdDto;
  resultMessage: string = '';
  messageResultType!: ResultType;
  isFinishOperation!: boolean;

  //#endregion

  //#region Input & Output & Others
  //#endregion

  constructor(private _coreService: FacadService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditRemittanceManuelIdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestModalDto<EditRemittanceManuelIdDto>) {
    // this.isLoading$ = this._coreService.Operation.isLoading$;
  }



  ngOnInit(): void {
    this.formElementInit();
    this.operationData=new EditRemittanceManuelIdDto();
    this.operationData=this.data.data;
  }
  formElementInit() {
    this.form = this.fb.group({
      manuelId: [null,Validators.required],
    });
  }
  edit(manuelId:string,operationId:number) {
    this.isLoading$=this._coreService.Operation.isLoading$;

    const _updateModel=new UpdateRemittanceManuelIdVm();
    _updateModel.manuelId=manuelId.trim();
    _updateModel.operationId=operationId;
    
    const sb=this._coreService.Operation.UpdateOperationManuelId(_updateModel).subscribe(result=>{
      if(result?.isSuccess){
        const actionText=this._coreService.errorHandler.getErrorText(result.resultAction);
        this._coreService.notification.showNotiffication(
          NotificationType.Success,actionText
        );
        this.dialogRef.close(result?.isSuccess);
        
      }else{
        const actionText=this._coreService.errorHandler.getErrorText(result!.resultAction);
        this._coreService.notification.showNotiffication(
          NotificationType.Success,actionText
        );
      }
    })
    this.subscriptions.push(sb);
  }
  validationManuelId(form: FormGroup){
    this.isLoading$=this._coreService.Operation.isModalLoading$;
    var _dateString=this._coreService.UtilityFunction.convertShamsiStringDateToMiladiStringDate(this.operationData.registerDate);
    const sb=this._coreService.Operation.CheckRemittanceMAnuelId(form.value.manuelId,_dateString).subscribe(result=>{
      if(result?.isSuccess){
        if(result.data){
          this.edit(form.value.manuelId,this.operationData.operationId);
        }else{
          this.isFinishOperation = true;
          this.messageResultType = ResultType.error;
          this.resultMessage = this._coreService.errorHandler.getErrorText(result!.resultAction);
        }
      }
    })
    this.subscriptions.push(sb);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());

  }
}
