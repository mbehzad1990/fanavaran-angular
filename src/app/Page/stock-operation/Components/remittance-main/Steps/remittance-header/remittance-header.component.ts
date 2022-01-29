import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatStep } from '@angular/material/stepper';
import * as moment from 'jalali-moment';
import { ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { HeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/header-info-dto';
import { StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { Customer } from 'src/shared/Domain/Models/_Customer/customer';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-remittance-header',
  templateUrl: './remittance-header.component.html',
  styleUrls: ['./remittance-header.component.scss']
})
export class RemittanceHeaderComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  headerForm!: FormGroup;
  persons!: Customer[];
  stocks!: Stock[];

  public bankCtrl: FormControl = new FormControl();
  public stockCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public personFilterCtrl: FormControl = new FormControl();
  public stockFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public filterPerson: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  public filterstock: ReplaySubject<Stock[]> = new ReplaySubject<Stock[]>(1);
  
  dateSelected:string='';

  numberPattern='^[0-9]*$';

  
  //#endregion

  //#region Input & OutPut & Other
  @Input() nextStepper!: MatStep;
  @Input() stockOperationType!: StockOperationType;
  @Output() headerInfo=new EventEmitter<RegisterStockOperationVm>();
  @Output() headerInfoDto=new EventEmitter<HeaderInfoDto>();
  //#endregion
  constructor(private _coreService: FacadService, private fb: FormBuilder) { }


  ngOnInit(): void {
    this.formElementInit();
    this.getPerson();
    this.getStock();

    this.personFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterPersons();
    });

    this.stockFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterStocks();
    });

  }
  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.headerForm
    );
  }
  formElementInit() {
    this.headerForm = this.fb.group({
      datePicker: [moment, Validators.required],
      batchNumber: [null, Validators.required],
      personSelect: [null, Validators.required],
      stockSelect: [null, Validators.required],
      personFilterCtrl: [null],
      description: [null],
     
      // stockFilterCtrl: [''],
    });
  }
  getPerson(){
    const sb=this._coreService.customer.items$.subscribe(_persons=>{
      this.persons=_persons;
      this.filterPerson.next(this.persons.slice());
    });
    this.subscriptions.push(sb);
  }
  getStock(){
    const sb=this._coreService.stock.stock$.subscribe(_stocks=>{
       this.filterstock.next(_stocks.slice());
      this.stocks=_stocks;
    });
    this.subscriptions.push(sb);
  }

  protected filterStocks() {
    if (!this.stocks) {
      return;
    }
    // get the search keyword
    let search = this.stockFilterCtrl.value;
    if (!search) {
      this.filterstock.next(this.stocks.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filterstock.next(
      this.stocks.filter(stock => stock.name.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterPersons() {
    if (!this.persons) {
      return;
    }
    // get the search keyword
    let search = this.personFilterCtrl.value;
    if (!search) {
      this.filterPerson.next(this.persons.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filterPerson.next(
      this.persons.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  nextStep(){
    this.nextStepper.completed = true;
    this.nextStepper._stepper.next();
  }

  submit(form: FormGroup){
    
    let _headerInfo=new RegisterStockOperationVm();
    _headerInfo.bacthNumber=form.value.batchNumber;
    _headerInfo.description=form.value.description;
    _headerInfo.personId=form.value.personSelect.id;
    _headerInfo.stockId=form.value.stockSelect.id;
    _headerInfo.stockOperationType=this.stockOperationType;
    _headerInfo.registerDate=new Date(moment.from( this.dateSelected, 'fa', 'YYYY/MM/DD').locale('en').format('YYYY/MM/DD'));
    
    let _headerDto=new HeaderInfoDto();
    _headerDto.stockName=form.value.stockSelect.name;
    _headerDto.personName=form.value.personSelect.name;
    _headerDto.description=form.value.personSelect;
    _headerDto.bachNumber=form.value.batchNumber;
    _headerDto.registerDate=this.dateSelected;
    // _headerInfo.registerDate=
    this.headerInfo.emit(_headerInfo);
    this.headerInfoDto.emit(_headerDto);
  }



  onChange(event: MatDatepickerInputEvent<moment.Moment>) {
    this.dateSelected = moment(event.value?.toString()).format("jYYYY/jMM/jDD");
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }


}
