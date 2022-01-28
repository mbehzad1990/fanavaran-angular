import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { ActionType, NotificationType, ResultType } from 'src/shared/Domain/Enums/global-enums';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { RegisterUnitVm } from 'src/shared/Domain/ViewModels/Unit/register-unit-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-edit-unit-modal',
  templateUrl: './add-edit-unit-modal.component.html',
  styleUrls: ['./add-edit-unit-modal.component.scss']
})
export class AddEditUnitModalComponent implements OnInit ,OnDestroy{

  //#region Private
  private subscriptions: Subscription[] = [];

  //#endregion

  //#region Public
  hidePassword = true;
  addStockForm!: FormGroup;
  isFinishOperation!: boolean;
  operationResultApi!: ResultDto<boolean>;
  resultMessage: string = '';
  messageResultType!: ResultType;
  title: string = '';
  btnText: string = '';
  //#endregion

  //#region Input & Output & Others
  //#endregion

  constructor(
    private _coreService: FacadService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditUnitModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestModalDto<Unit>
  ) { }

  ngOnInit(): void {
    this.setTitle();
    this.formElementInit();
  }
  formElementInit() {
    if(this.data.action==ActionType.Add){
      this.addStockForm = this.fb.group({
        name: ['', Validators.required],
        address: [''],
        phone: [''],
        description:['']
      });
    }else{
        this.addStockForm = this.fb.group({
          name: [this.data.data.name, Validators.required],
          description:[this.data.data.description]
        });
    }
  }
  setTitle() {
    if (this.data.action == ActionType.Add) {
        this.title = 'افزودن واحد اندازه گیری';
        this.btnText='اعمال تغییرات';
    }else{
        this.title = 'ویرایش واحد - '+this.data.data.name;
        this.btnText='ویرایش';
    }
  }
  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.addStockForm
    );
  }
  add(addModel:RegisterUnitVm){
    const sb=this._coreService.unit.add(addModel).subscribe(result=>{
      if (result?.isSuccess) {
        this._coreService.notification.showNotiffication(
          NotificationType.Success,
          this._coreService.errorHandler.getErrorText(result?.resultAction)
        );
        this.dialogRef.close();
      }else{
        this.isFinishOperation=true;
        this.messageResultType=ResultType.error;
        this.resultMessage=this._coreService.errorHandler.getErrorText(result!.resultAction);
      }
    });
    this.subscriptions.push(sb);
  }
  update(updateModel:RegisterUnitVm){
     const sb=this._coreService.unit.edit(updateModel).subscribe(result=>{
      if (result?.isSuccess) {
        this._coreService.notification.showNotiffication(
          NotificationType.Success,
          this._coreService.errorHandler.getErrorText(result?.resultAction)
        );
        this.dialogRef.close();
      }else{
        this.isFinishOperation=true;
        this.messageResultType=ResultType.error;
        this.resultMessage=this._coreService.errorHandler.getErrorText(result!.resultAction);
      }
    });
    this.subscriptions.push(sb);
  }
  submit(name:string,dec:string){
    if (this.data.action == ActionType.Add) {
      const model=new RegisterUnitVm();
      model.name=name;
      model.description=dec;
      
      this.add(model);
    }else{
      const model=new RegisterUnitVm();
      model.name=name;
      model.description=dec;
      model.id=this.data.data.id;
       
      this.update(model);
    }
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
