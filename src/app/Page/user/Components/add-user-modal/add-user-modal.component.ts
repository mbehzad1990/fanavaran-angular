import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Subscription } from 'rxjs';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { NotificationType, ResultAction, ResultType } from 'src/shared/Domain/Enums/global-enums';
import { RegisterVm } from 'src/shared/Domain/ViewModels/_User/register-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.scss']
})
export class AddUserModalComponent implements OnInit , OnDestroy {
  //#region Private
  private subscriptions: Subscription[] = [];
  // private deviceData!: DeviceModel;

  //#endregion

  //#region Public
  hidePassword = true;
  adduserForm!: FormGroup;
  isFinishOperation!: boolean;
  operationResultApi!: ResultDto<boolean>;
  resultMessage: string = '';
  messageResultType!: ResultType;
  //#endregion

  //#region Input & Output & Others
  //#endregion
  constructor(
    private _coreService: FacadService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.formElementInit();
    this.adduserForm.reset();
  }
  formElementInit() {
    this.adduserForm = this.fb.group({
      fullname: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: [''],
    });
  }
  addUser(name: string, userName: string, password: string, email: string) {

    const model = new RegisterVm();
    model.fullName = name;
    model.userName = userName;
    model.password = password;
    model.email = email;

    const sb = this._coreService.user
      .registerUser(model)
      .pipe(
        map((resp: ResultDto<boolean>) => {
          if (resp.isSuccess) {
            this._coreService.notification.showNotiffication(
              NotificationType.Success,
              this._coreService.errorHandler.getErrorText(resp?.resultAction)
            );
            this._coreService.user.getAllUsers();
          }else{
            this.isFinishOperation=true;
            this.messageResultType=ResultType.error;
            this.resultMessage=this._coreService.errorHandler.getErrorText(resp.resultAction);
          }
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }
  getOperationResult(result: ResultAction): string {
    return this._coreService.errorHandler.getErrorText(result);
  }
  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.adduserForm
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
