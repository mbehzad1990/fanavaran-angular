import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'jalali-moment';
import { ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { GoodDetailDto } from 'src/shared/Domain/Dto/_Good/good-detail-dto';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import { GoodDetail } from 'src/shared/Domain/ViewModels/_stockOperationDetail/good-detail';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.scss']
})
export class AddDetailsComponent implements OnInit, OnDestroy {
  //#region Private
  private numberChars = new RegExp("[^0-9]", "g")
  private units: Unit[] = [];
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

  goods!: GoodDetailsVm[];

  public goodCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public goodFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public filterGoods: ReplaySubject<GoodDetailsVm[]> = new ReplaySubject<GoodDetailsVm[]>(1);
  dateSelected: string = '';
  // unit_selected!:Unit;
  numberPattern = '^[0-9]*$';
  isOperationRun: boolean = false;
  //#endregion

  //#region Input & Output & Others
  @Output() itemForAdd = new EventEmitter<GoodDetailDto>();

  //#endregion

  constructor(private _coreService: FacadService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.getGoods();
    this.formElementInit();

    this.goodFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInGoods();
      });
  }

  formElementInit() {
    this.pageForm = this.fb.group({
      goodCtrl: [null, Validators.required,],
      count: [null, Validators.required],
      price: [null, Validators.required],
      datePicker: [null],
      batchNumber: [""],
      dec: [null],

      // stockFilterCtrl: [''],
    });
  }

  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.pageForm
    );
  }
  onChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.dateSelected = moment(event.value?.toISOString()).format("jYYYY/jMM/jDD");
  }
  clearDate(event:Event){
    event.stopPropagation();
    this.pageForm.controls['datePicker'].setValue('');
  }
  add(form: FormGroup) {
    const addModel = new GoodDetailDto();

    addModel.goodId = form.value.goodCtrl.id;
    addModel.goodManuelId=this.getGoodManuelId(addModel.goodId);
    addModel.goodName = form.value.goodCtrl.name;
    if(form.value.batchNumber===null || form.value.batchNumber===undefined){
      addModel.bacthNumber="";
    }else{
      addModel.bacthNumber = form.value.batchNumber;
    }

    if (this.dateSelected != '') {
      const _dateSelected=new Date(moment.from( this.dateSelected ,'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
      addModel.expireDate=this._coreService.UtilityFunction.convertMiladiDateToString(_dateSelected);
      // addModel.expireDate = new Date(moment.from(this.dateSelected, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD')).toString();
    }

    addModel.count = form.value.count;
    const val = form.value.price;
    addModel.price = Number(val.replace(this.numberChars, ""));
    addModel.amount = addModel.count * addModel.price;
    addModel.description = form.value.dec;
    addModel.unitName = form.value.goodCtrl.unitName;

    // For your convenience
    // Don't save formatting, remove commas and dots
    if (typeof val === "string") {
      console.log(`${typeof val} ${Number(val.replace(this.numberChars, ""))}`);
    } else {
      console.log(`${typeof val} ${val}`);
    }

    this.pageForm.reset();
    this.dateSelected='';
    this.itemForAdd.emit(addModel);
  }
  getGoods() {
    const sb = this._coreService.good.items$.subscribe(good => {
      this.goods = good;
      this.filterGoods.next(this.goods.slice());

    });
    this.subscriptions.push(sb);
  }
  getUnits() {
    const sb = this._coreService.unit.items$.subscribe(unit => {
      this.units = unit;
    });
    this.subscriptions.push(sb);
  }
  getUnitNameById(unitId: number): string {
    let _unitName: string = '';
    this.units.forEach(item => {
      if (item.id == unitId) {
        _unitName = item.name;
      }
    })
    return _unitName;
  }
  protected filterInGoods() {
    if (!this.goods) {
      return;
    }
    // get the search keyword
    let search = this.goodFilterCtrl.value;
    if (!search) {
      this.filterGoods.next(this.goods.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filterGoods.next(
      this.goods.filter(g => g.name.toLowerCase().indexOf(search) > -1)
    );
  }
  private getGoodManuelId(goodId:number):string{
    const model=this.goods.filter(p=>p.id==goodId)[0];
    return model.manualId;
  }
  // formElementDataReset(){
  //   this.pageForm.reset();
  //   this.
  // }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
