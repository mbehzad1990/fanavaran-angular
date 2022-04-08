import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { ResultDto } from 'src/shared/Domain/Dto/_Modal/result-dto';
import { Unit } from 'src/shared/Domain/Models/_Unit/unit';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import * as moment from 'jalali-moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { GoodOfRemittanceDto } from 'src/shared/Domain/Dto/_Good/good-of-remittance-dto';
import { ReturnShareDataService } from '../../Service/return-share-data.service';
import { GoodDetailDto } from 'src/shared/Domain/Dto/_Good/good-detail-dto';
import { DecimalPipe } from '@angular/common';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-return-add-details',
  templateUrl: './return-add-details.component.html',
  styleUrls: ['./return-add-details.component.scss']
})
export class ReturnAddDetailsComponent implements OnInit, OnDestroy {

  //#region Private
  private subscriptions: Subscription[] = [];
  private numberChars = new RegExp("[^0-9]", "g")
  private units: Unit[] = [];
  private currencyChars = new RegExp('[\.,]', 'g')
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
  public filterGoods: ReplaySubject<GoodOfRemittanceDto[]> = new ReplaySubject<GoodOfRemittanceDto[]>(1);
  goodOfRemittance: GoodOfRemittanceDto[] = [];
  dateSelected: string = '';
  // unit_selected!:Unit;
  numberPattern = '^[0-9]*$';
  isOperationRun: boolean = false;
  goods: GoodDetailsVm[] = [];
  listOfGoodIsOK: boolean = false;
  _currentGoodCount: number = 0;
  _currentGood!: GoodOfRemittanceDto;


  //#endregion

  //#region Input & Output & Others
  @Output() itemForAdd = new EventEmitter<GoodDetailDto>();

  //#endregion

  constructor(private _coreService: FacadService, private fb: FormBuilder, private _shareData: ReturnShareDataService, 
    private decimalPipe: DecimalPipe) { }

  ngOnInit(): void {
    this.formElementInit();
    this.getGood();
    this.getAllUnit();
    // this.getData() ;
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
      price: [null, Validators.required,],
      batchNumber: [null, Validators.required],
      datePicker: [moment, Validators.required],
      dec: [null],

      // stockFilterCtrl: [''],
    });
    this.pageForm.controls['price'].disable();
    this.pageForm.controls['batchNumber'].disable();
    this.pageForm.controls['datePicker'].disable();
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

  getUnits() {
    const sb = this._coreService.unit.items$.subscribe(unit => {
      this.units = unit;
    });
  }

  add(form: FormGroup) {
    if (parseInt(form.value.count) > this._currentGoodCount) {
      this._coreService.notification.showNotiffication(NotificationType.Error, 'تعداد بیش از حد مجاز است');
    }
    else {

      const addModel = new GoodDetailDto();
      addModel.goodId = this._currentGood.goodId;
      addModel.goodName = form.controls['goodCtrl'].value.name;
      addModel.bacthNumber = form.controls['batchNumber'].value;
      if (form.controls['datePicker'].value != undefined) {
        addModel.expireDate=this._coreService.UtilityFunction.convertMiladiDateToString(form.controls['datePicker'].value.toString());

        // addModel.expireDate = new Date(moment.from(date, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD')).toString();
      }
      // addModel.expireDate=null;
      addModel.count = form.value.count;
      const val = form.controls['price'].value;
      addModel.price = Number(val.replace(this.numberChars, ""));
      addModel.amount = addModel.count * addModel.price;
      addModel.description = form.value.dec;
      addModel.unitName = this.getUnitNameByUnitId(addModel.goodId);

      // For your convenience
      // Don't save formatting, remove commas and dots
      if (typeof val === "string") {
        console.log(`${typeof val} ${Number(val.replace(this.numberChars, ""))}`);
      } else {
        console.log(`${typeof val} ${val}`);
      }

      this.pageForm.reset();

      this.itemForAdd.emit(addModel);
    }
  }
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
  private getData() {
    const sb = this._shareData.returnGoodOfRemittance$.subscribe(data => {
      if (data.length > 0) {
        data.forEach(item => {
          const good = new GoodOfRemittanceDto();
          good.goodId = item.goodId;
          good.name = this.getGoodName(good.goodId);
          good.bacthNumber = item.bacthNumber;
          good.count = item.count;
          good.goodManuelId = item.goodManuelId;
          if (good.expireDate != null) {
            good.expireDate = item.expireDate!;
          }
          good.price = item.price;
          good.amount = item.amount;

          this.goodOfRemittance.push(good);
        })

      }
    })
    this.listOfGoodIsOK = true;
    this.filterGoods.next(this.goodOfRemittance.slice());
    this.subscriptions.push(sb);
  }
  private getGoodName(goodId: number): string {
    let goodName: string = '';
    this.goods.forEach(item => {
      if (item.id == goodId) {
        goodName = item.name;
      }
    })
    return goodName;
  }
  getDetails(form: FormGroup, value: GoodOfRemittanceDto) {
    form.controls['batchNumber'].setValue(value.bacthNumber);
    form.controls['price'].patchValue(this.format(value.price.toString()));
    form.controls['batchNumber'].setValue(value.bacthNumber);
    form.controls['datePicker'].setValue(value.expireDate);
    form.controls['count'].setValue(value.count);
    this._currentGoodCount = value.count;
    this._currentGood = value;
  }
  private getGood() {
    this._coreService.good.getAll();
    let goodName: string = '';
    const sb = this._coreService.good.items$.subscribe(data => {
      if (data.length > 0) {
        this.goods = data;
        if (!this.listOfGoodIsOK) {
          this.getData();
        }
      }
    })
    this.subscriptions.push(sb);
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
  private format(val: string): string {
    // 1. test for non-number characters and replace/remove them
    const numberFormat = parseInt(String(val).replace(this.currencyChars, ''));
    // console.log(numberFormat); // raw number

    // 2. format the number (add commas)
    const usd = this.decimalPipe.transform(numberFormat, '1.0', 'en-US');
    return usd!;
    // 3. replace the input value with formatted numbers
    // this.renderer.setProperty(this.el.nativeElement, 'value', usd);
  }
  private getGoodManuelId(goodId: number): number {
    const model = this.goods.filter(p => p.id == goodId)[0];
    return model.manualId;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sp => sp.unsubscribe());
  }
}
