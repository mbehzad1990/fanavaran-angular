import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RequestModalDto } from 'src/shared/Domain/Dto/_Modal/request-modal-dto';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { ActionType, NotificationType, ResultType } from 'src/shared/Domain/Enums/global-enums';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import { RegisterGoodVm } from 'src/shared/Domain/ViewModels/_Good/register-good-vm';
import { UpdateGoodVm } from 'src/shared/Domain/ViewModels/_Good/update-good-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-edit-good-modal',
  templateUrl: './add-edit-good-modal.component.html',
  styleUrls: ['./add-edit-good-modal.component.scss']
})
export class AddEditGoodModalComponent implements OnInit , OnDestroy {

  //#region Private
  private subscriptions: Subscription[] = [];

  //#endregion

  //#region Public
  hidePassword = true;
  modalForm!: FormGroup;
  isFinishOperation!: boolean;
  operationResultApi!: ResultDto<boolean>;
  resultMessage: string = '';
  messageResultType!: ResultType;
  title: string = '';
  btnText: string = '';

  isSetManualId: boolean = false;

  isLoading = false;
  isOpen = false;

  units: Unit[] = [];
  unit_selected!:Unit;

  isActiveAddUnitBtn:boolean=false;
  //#endregion

  //#region Input & Output & Others
  //#endregion
  constructor(
    private _coreService: FacadService,
    private router:Router,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditGoodModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RequestModalDto<GoodDetailsVm>
  ) { }


  ngOnInit(): void {
    this.setTitle();
    this.getUnit();
    this.formElementInit();
    if (this.data.action == ActionType.Update){
      this.getGoodState(this.data.data.id);
    }
  }
  formElementInit() {
    if (this.data.action == ActionType.Add) {
      this.modalForm = this.fb.group({
        name: ['', Validators.required],
        unit: ['', Validators.required],
        latinName: [''],
        manualId: [''],
        description: ['']
      });
    } else {
      this.modalForm = this.fb.group({
        name: [this.data.data.name, Validators.required],
        unit: [this.data.data.unitId, Validators.required],
        description: [this.data.data.description],
        latinName: [this.data.data.latinName],
        manualId: [this.data.data.manualId]
      });
    }
  }
  setTitle() {
    if (this.data.action == ActionType.Add) {
      this.title = 'افزودن انبار جدید';
      this.btnText = 'اعمال تغییرات';
    } else {
      this.title = 'ویرایش انبار - ' + this.data.data.name;
      this.btnText = 'ویرایش';
    }
  }
  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.modalForm
    );
  }
  add(addModel: RegisterGoodVm) {
    const sb = this._coreService.good.add(addModel).subscribe(result => {
      if (result?.isSuccess) {
        this._coreService.notification.showNotiffication(
          NotificationType.Success,
          this._coreService.errorHandler.getErrorText(result?.resultAction)
        );
        this.dialogRef.close();
      } else {
        this.isFinishOperation = true;
        this.messageResultType = ResultType.error;
        this.resultMessage = this._coreService.errorHandler.getErrorText(result!.resultAction);
      }
    });
    this.subscriptions.push(sb);
  }
  update(updateModel: UpdateGoodVm) {
    const sb = this._coreService.good.edit(updateModel).subscribe(result => {
      if (result?.isSuccess) {
        this._coreService.notification.showNotiffication(
          NotificationType.Success,
          this._coreService.errorHandler.getErrorText(result?.resultAction)
        );
        this.dialogRef.close();
      } else {
        this.isFinishOperation = true;
        this.messageResultType = ResultType.error;
        this.resultMessage = this._coreService.errorHandler.getErrorText(result!.resultAction);
      }
    });
    this.subscriptions.push(sb);
  }
  submit(form: FormGroup) {
    if (this.data.action == ActionType.Add) {
      const addModel = new RegisterGoodVm();
      if (this.isSetManualId) {
        addModel.manualId = parseInt(form.value.manualId);
      } else {
        addModel.manualId = 0;
      }
      addModel.name = form.value.name;
      addModel.latinName = form.value.latinName;
      addModel.description = form.value.description;
      addModel.unitId = parseInt(form.value.unit);
      this.add(addModel);
    } else {
      const updatModel = new UpdateGoodVm();
      updatModel.id=this.data.data.id;
      updatModel.name=form.value.name;
      updatModel.latinName=form.value.latinName;
      updatModel.manualId=parseInt(form.value.manualId);
      updatModel.description=form.value.description;
      updatModel.unitId=parseInt(form.value.unit);

      this.update(updatModel);
    }
  }
  openChanged(event: boolean) {
    this.isOpen = event;
    this.isLoading = event;
    if (event) {
      this.units = [];
      this.modalForm.get('unit')?.reset();
      this.getUnit();
    }
  }
  getUnit() {
    const sb = this._coreService.unit.items$.subscribe(obs => {
      this.units = obs;
      this.isLoading = false;
    })

    this.subscriptions.push(sb);
  }
  navigate(e:any){
    e.preventDefault();
    this.router.navigate(['/unit']);
    this.dialogRef.close();
  }
  getUnitSelected(item: Unit) {
    if (item) {
      // this.isSelectedBrand = true;
      if (item != this.unit_selected) {
        this.unit_selected = item;
        // this.isBrandSelected = true;
      }
    }
  }
  getGoodState(goodId:number){
    const sb=this._coreService.good.findGoodInRemittance(goodId).subscribe(result=>{
      if(result?.data){
        this.modalForm.controls['unit'].disable();
        this.modalForm.controls['manualId'].disable();
        this.isActiveAddUnitBtn=true;
      }
    });
    this.subscriptions.push(sb);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
