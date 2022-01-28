import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { RegisterGoodVm } from 'src/shared/Domain/ViewModels/_Good/register-good-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-data',
  templateUrl: './add-data.component.html',
  styleUrls: ['./add-data.component.scss']
})
export class AddDataComponent implements OnInit ,OnDestroy {
  //#region Private
  private subscriptions: Subscription[] = [];

  //#endregion

  //#region Public
  hidePassword = true;
  pageForm!: FormGroup;
  isFinishOperation!: boolean;
  operationResultApi!: ResultDto<boolean>;
  // resultMessage: string = '';
  // messageResultType!: ResultType;
  title: string = '';
  btnText: string = '';

  isSetManualId: boolean = false;

  isLoading = false;
  isOpen = false;

  units: Unit[] = [];
  
  // unit_selected!:Unit;
  //#endregion

  //#region Input & Output & Others
  @Output() itemForAdd=new EventEmitter<RegisterGoodVm>();
  //#endregion
  constructor(private _coreService:FacadService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.formElementInit();
  }
  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.pageForm
    );
  }
  openChanged(event: boolean) {
    this.isOpen = event;
    this.isLoading = event;
    if (event) {
      this.units = [];
      this.pageForm.get('unit')?.reset();
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
  formElementInit() {
      this.pageForm = this.fb.group({
        name: ['', Validators.required],
        unit: ['', Validators.required],
        latinName: [''],
        dec: ['']
      });
  }
  add(form: FormGroup){
    const addModel = new RegisterGoodVm();
    addModel.manualId = 0;
    addModel.name = form.value.name;
    addModel.latinName = form.value.latinName;
    addModel.description = form.value.description;
    addModel.unitId = parseInt(form.value.unit);
    this.pageForm.reset();
    this.itemForAdd.emit(addModel);
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb=>sb.unsubscribe());
  }
}
