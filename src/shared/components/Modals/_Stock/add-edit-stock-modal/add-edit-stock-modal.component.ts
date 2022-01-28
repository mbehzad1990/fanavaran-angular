import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { ActionType, NotificationType, ResultType } from 'src/shared/Domain/Enums/global-enums';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';
import { RegisterStokVm } from 'src/shared/Domain/ViewModels/Stock/register-stok-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-edit-stock-modal',
  templateUrl: './add-edit-stock-modal.component.html',
  styleUrls: ['./add-edit-stock-modal.component.scss']
})
export class AddEditStockModalComponent implements OnInit,OnDestroy {


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
   title:string='';
   btnText:string='';
   //#endregion
 
   //#region Input & Output & Others
   //#endregion
  constructor(
    private _coreService: FacadService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditStockModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestModalDto<Stock>
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
          address: [this.data.data.address],
          phone: [this.data.data.phone],
          description:[this.data.data.description]
        });
    }
  }
  setTitle() {
    if (this.data.action == ActionType.Add) {
        this.title = 'افزودن انبار جدید';
        this.btnText='اعمال تغییرات';
    }else{
        this.title = 'ویرایش انبار - '+this.data.data.name;
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
  addStock(addModel:RegisterStokVm){

    const sb=this._coreService.stock.addStock(addModel).subscribe(result=>{
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
  updateStock(updateModel:Stock){
     const sb=this._coreService.stock.editStock(updateModel).subscribe(result=>{
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
  submit(name:string,address:string,phone:string,dec:string){
    if (this.data.action == ActionType.Add) {
      const model=new RegisterStokVm();
      model.name=name;
      model.address=address;
      model.phone=phone;
      model.description=dec;
      
      this.addStock(model);
    }else{
      const model=new Stock();
      model.name=name;
      model.address=address;
      model.phone=phone;
      model.description=dec;
      model.id=this.data.data.id;
       
      this.updateStock(model);
    }
  }



  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}

