import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, distinct, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { GoodOfRemittanceDto } from 'src/shared/Domain/Dto/_Good/good-of-remittance-dto';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import * as moment from 'jalali-moment';
import { GoodDetailDto } from 'src/shared/Domain/Dto/_Good/good-detail-dto';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DecimalPipe } from '@angular/common';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { ReportOperationVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-vm';
import { EditRemittanceSharedService } from '../../Service/edit-remittance-shared.service';
import { ReportOperationDetailVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-detail-vm';


@Component({
  selector: 'app-remittance-crud-element',
  templateUrl: './remittance-crud-element.component.html',
  styleUrls: ['./remittance-crud-element.component.scss']
})
export class RemittanceCrudElementComponent implements OnInit, OnDestroy {
  //#region Private
  private subscriptions: Subscription[] = [];
  private numberChars = new RegExp("[^0-9]", "g")
  private units: Unit[] = [];
  private currencyChars = new RegExp('[\.,]', 'g')
  private _defaultData!: ReportOperationVm;
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

  public goodCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public goodFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  filterGoods: ReplaySubject<GoodOfRemittanceDto[]> = new ReplaySubject<GoodOfRemittanceDto[]>(1);
  goodOfRemittance: GoodOfRemittanceDto[] = [];
  dateSelected: string = '';
  // unit_selected!:Unit;
  numberPattern = '^[0-9]*$';
  isOperationRun: boolean = false;
  goods: GoodDetailsVm[] = [];
  listOfGoodIsOK: boolean = false;
  _currentGoodCount: number = 0;
  _currentGood!: GoodOfRemittanceDto;


  isEditMode: boolean = false;
  //#endregion

  //#region Input & Output & Others
  @Output() itemForAdd = new EventEmitter<GoodDetailDto>();
  @Input() remittanceReturnType!: boolean; //false= return Remittance true= defualt remittance
  @Output() itemExport=new EventEmitter<ReportOperationDetailVm>();
  @Output() actionMode=new EventEmitter<boolean>();
  

  //#endregion
  constructor(private _coreService: FacadService, private fb: FormBuilder, private decimalPipe: DecimalPipe, private _localService: EditRemittanceSharedService) {
    const sb = this._localService.remittanceDefualtData$.subscribe(data => {
      if (data) {
        this._defaultData = data;
      }
    });
    this.subscriptions.push(sb);
  }


  ngOnInit(): void {

    this.formElementInit();
    this.getGoods()
    this.getAllUnit();
    this.goodFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterInGoods();
      });
  }
  //#region  Public Method
  formElementInit() {
    this.pageForm = this.fb.group({
      goodCtrl: [null, Validators.required,],
      count: [null, Validators.required],
      price: [null, Validators.required,],
      batchNumber: [''],
      datePicker: [null],
      dec: [null],

      // stockFilterCtrl: [''],
    });
    // if (!this.remittanceReturnType) {
    //   this.pageForm.controls['price'].disable();
    //   this.pageForm.controls['batchNumber'].disable();
    //   this.pageForm.controls['datePicker'].disable();
    // }
  }
  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.pageForm
    );
  }
  getDetails(form: FormGroup, value: GoodOfRemittanceDto) {
    
    if (!this.remittanceReturnType) {
      form.controls['batchNumber'].setValue(value.bacthNumber);
      form.controls['price'].patchValue(this.format(value.price.toString()));
      form.controls['batchNumber'].setValue(value.bacthNumber);
      form.controls['datePicker'].setValue(value.expireDate);
      this._currentGoodCount = value.count;
      this._currentGood = value;
    }
  }
  onChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.dateSelected = moment(event.value?.toISOString()).add(1,'day').format("jYYYY/jMM/jDD");
  }
  add(form: FormGroup) {
    // if (parseInt(form.value.count) > this._currentGoodCount) {
    //   this._coreService.notification.showNotiffication(NotificationType.Error, 'تعداد بیش از حد مجاز است');
    // }
    // else {
      const model=new ReportOperationDetailVm();
      const addModel = new GoodDetailDto();
      addModel.goodId = form.controls['goodCtrl'].value.goodId;
      model.goodId = form.controls['goodCtrl'].value.goodId;
      model.goodName = form.controls['goodCtrl'].value.name;
      model.bacthNumber = form.controls['batchNumber'].value;
      addModel.goodName = form.controls['goodCtrl'].value.name;
      addModel.bacthNumber = form.controls['batchNumber'].value;
      if ( form.controls['datePicker'].value!=null) {
        const date = moment(form.controls['datePicker'].value.toString()).format("jYYYY/jMM/jDD");
        addModel.expireDate = new Date(moment.from(date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
        model.expireDate = new Date(moment.from(date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
      }
      addModel.expireDate = null;
      model.expireDate = null;
      model.count = form.value.count;      
      addModel.count = form.value.count;      

      const val = form.controls['price'].value;
      model.price = Number(val.replace(this.numberChars, ""));
      model.description = form.value.dec;
      addModel.price = Number(val.replace(this.numberChars, ""));
      addModel.amount = addModel.count * addModel.price;
      model.amount = addModel.count * addModel.price;
      addModel.description = form.value.dec;
      model.unitName=this.getUnitNameByGoodId(model.goodId);
      // addModel.unitName = this.getUnitNameByUnitId(addModel.goodId);

      // For your convenience
      // Don't save formatting, remove commas and dots
      if (typeof val === "string") {
        console.log(`${typeof val} ${Number(val.replace(this.numberChars, ""))}`);
      } else {
        console.log(`${typeof val} ${val}`);
      }
      debugger
      this.pageForm.reset();
      this.actionMode.emit(this.isEditMode);
      this.itemForAdd.emit(addModel);
      this.itemExport.emit(model);
      this.isEditMode = false;
    // }
  }
  editMode(value: GoodOfRemittanceDto) {
    this.isEditMode = true;
    this.pageForm.controls['batchNumber'].setValue(value.bacthNumber);
    this.pageForm.controls['price'].patchValue(this.format(value.price.toString()));
    this.pageForm.controls['batchNumber'].setValue(value.bacthNumber);
    this.pageForm.controls['datePicker'].setValue(value.expireDate);
    this.pageForm.controls['count'].setValue(value.count);
    this.pageForm.controls['goodCtrl'].setValue(this.getGoodModelById(value.goodId));
    this._currentGoodCount = value.count;
    this._currentGood = value;
    console.log(this.pageForm);
  }
  reset(){
    this.pageForm.reset();
  }
  clearDate(event:Event){
    event.stopPropagation();
    this.pageForm.controls['datePicker'].setValue('');
  }
  //#endregion


  //#region Private Method
  protected filterInGoods() {
    if (!this.goodOfRemittance) {
      return;
    }
    // get the search keyword
    let search = this.goodFilterCtrl.value;
    if (!search) {
      this.filterGoods.next(this.goodOfRemittance.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filterGoods.next(
      this.goodOfRemittance.filter(g => g.name.toLowerCase().indexOf(search) > -1)
    );
  }
  private getGoods() {
    //false= return Remittance true= defualt remittance

    // if (this.remittanceReturnType) {
      const sb = this._coreService.good.items$.subscribe(goods => {
        if (goods.length > 0) {
          this.goods = goods;
          goods.forEach(item => {
            const good = new GoodOfRemittanceDto();
            good.goodId = item.id;
            good.name = item.name;
            this.goodOfRemittance.push(good);
          })
          this.filterGoods.next(this.goodOfRemittance.slice());

        }
      })
      this.listOfGoodIsOK = true;
      this.subscriptions.push(sb);
    // } else {
    //   this.fetchData();
    //   let goodName: string = '';
    //   const sb = this._coreService.good.items$.subscribe(data => {
    //     if (data.length > 0) {
    //       this.goods = data;
    //       if (!this.listOfGoodIsOK) {
    //         this.getData();
    //       }
    //     }
    //   })
    //   this.subscriptions.push(sb);
    // }

  }
  private getAllUnit() {
    this._coreService.unit.getAll();
    const sb = this._coreService.unit.items$.subscribe(data => {
      this.units = data;
    })
  }
  private getUnitNameByUnitId(unitId: number): string {
    let unitName: string = '';
    this.units.forEach(item => {
      if (item.id == unitId) {
        unitName = item.name;
      }
    })
    return unitName;
  }
  private getUnitNameByGoodId(goodId:number):string{
    let unitName: string = '';
    const goodUintId=this.goods.filter(p=>p.id==goodId)[0];
    return goodUintId.unitName;
  }
  private fetchData() {
    const sb = this._coreService.Operation.GetListOfOperationDetails(this._defaultData.id).subscribe();
    this.subscriptions.push(sb);
  }
  private getData() {
    const sb = this._coreService.Operation.operationDetailList$.subscribe(data => {
      if (data.length > 0) {
        data.forEach(item => {
          const good = new GoodOfRemittanceDto();
          good.goodId = item.goodId;
          good.name = item.goodName
          good.bacthNumber = item.bacthNumber;
          good.count = item.count;
          if (good.expireDate != null) {
            good.expireDate = item.expireDate!;
          }
          good.price = item.price;
          good.amount = item.amount;

          this.goodOfRemittance.push(good);
        })
      }
    });
    this.listOfGoodIsOK = true;
    this.filterGoods.next(this.goodOfRemittance.slice());
    this.subscriptions.push(sb);
  }
  private format(val: string): string {
    // 1. test for non-number characters and replace/remove them
    const numberFormat = parseInt(String(val).replace(this.currencyChars, ''));
    // console.log(numberFormat); // raw number

    // 2. format the number (add commas)
    const usd = this.decimalPipe.transform(numberFormat, '1.0', 'en-US');
    return usd!;
  }
  private getGoodModelById(goodId: number): GoodOfRemittanceDto {
    return this.goodOfRemittance.filter(p => p.goodId == goodId)[0];
  }

  //#endregion
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
