import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { ActionType, NotificationType, ResultType } from 'src/shared/Domain/Enums/global-enums';
import { Customer } from 'src/shared/Domain/Models/_Customer/customer';
import { CustomerRegisterVm } from 'src/shared/Domain/ViewModels/Customer/customer-register-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-edit-customer-modal',
  templateUrl: './add-edit-customer-modal.component.html',
  styleUrls: ['./add-edit-customer-modal.component.scss']
})
export class AddEditCustomerModalComponent implements OnInit,OnDestroy {

 //#region Private
 private subscriptions: Subscription[] = [];

 //#endregion

 //#region Public
 hidePassword = true;
 crudForm!: FormGroup;
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
   public dialogRef: MatDialogRef<AddEditCustomerModalComponent>,
   @Inject(MAT_DIALOG_DATA) public data: RequestModalDto<Customer>
 ) { }
  ngOnDestroy(): void {
  
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }

 ngOnInit(): void {
   this.setTitle();
   this.formElementInit();
 }

 formElementInit() {
   if(this.data.action==ActionType.Add){
     this.crudForm = this.fb.group({
       name: ['', Validators.required],
       address: [''],
       phone: [''],
       mobile:[''],
       description:['']
     });
   }else{
       this.crudForm = this.fb.group({
         name: [this.data.data.name, Validators.required],
         address: [this.data.data.address],
         phone: [this.data.data.phone],
         mobile:[this.data.data.mobile],
         description:[this.data.data.description]
       });
   }
 }
 setTitle() {
   if (this.data.action == ActionType.Add) {
       this.title = 'افزودن مشتری';
       this.btnText='اعمال تغییرات';
   }else{
       this.title = 'ویرایش مشتری - '+this.data.data.name;
       this.btnText='ویرایش';
   }
 }
 errorHandling(control: string, error: string) {
   return this._coreService.errorHandler.conrollerErrorHandler(
     control,
     error,
     this.crudForm
   );
 }

 add(addModel:CustomerRegisterVm){
   const sb=this._coreService.customer.add(addModel).subscribe(result=>{
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
 edit(updateModel:Customer){
    const sb=this._coreService.customer.edit(updateModel).subscribe(result=>{
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
 submit(name:string,address:string,phone:string,dec:string,mobile:string){
   if (this.data.action == ActionType.Add) {
     const model=new CustomerRegisterVm();
     model.name=name;
     model.address=address;
     model.phone=phone;
     model.description=dec;
     model.mobile=mobile;
     
     this.add(model);
   }else{
     const model=new Customer();
     model.name=name;
     model.address=address;
     model.phone=phone;
     model.description=dec;
     model.mobile=mobile;
     model.id=this.data.data.id;
      
     this.edit(model);
   }
 }

}

