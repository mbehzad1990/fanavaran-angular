import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { Customer } from 'src/shared/Domain/Models/_Customer/customer';
import { CustomerFactorDetailsVm } from 'src/shared/Domain/ViewModels/_Customer/customer-factor-details-vm';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import * as moment from 'jalali-moment';
import { MatStep } from '@angular/material/stepper';
import { HeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/header-info-dto';
import { RetrnHeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/retrn-header-info-dto';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ReturnHeaderDto } from 'src/shared/Domain/Dto/_Operation/ReturnRemittance/return-header-dto';
import { SetDateModalComponent } from './set-date-modal/set-date-modal.component';
import { ReturnShareDataService } from '../Service/return-share-data.service';


@Component({
  selector: 'app-return-remittance-header',
  templateUrl: './return-remittance-header.component.html',
  styleUrls: ['./return-remittance-header.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReturnRemittanceHeaderComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  isLoading$!: Observable<boolean>;

  personFilterCtrl: FormControl = new FormControl();
  persons!: Customer[];
  protected _onDestroy = new Subject<void>();
  filterPerson: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);

  dataSource = new MatTableDataSource<CustomerFactorDetailsVm>([]);
  displayedColumns: string[] = ['collapse', 'index', 'stockOperationId', 'registerDate', 'stockName', 'description', 'select'];
  expandedElement!: CustomerFactorDetailsVm | null;
  form!: FormGroup;
  toggleFilters = true;
  dateSelected: string = '';
  isStepComplete: boolean = false;
  //#endregion

  //#region Input & OutPut & Other
  @Input() stockOperationType!: StockOperationType;
  @Input() nextStepper!: MatStep;
  @Output() _retrnHeaderInfoDto = new EventEmitter<RetrnHeaderInfoDto>();
  @Output() _remittanceMabna = new EventEmitter<CustomerFactorGoodsVm[]>();
  //#endregion
  constructor(private _coreService: FacadService, private dialog: MatDialog, private fb: FormBuilder, private _shareData: ReturnShareDataService) {
    this.isLoading$ = this._coreService.Operation.isLoading$;
  }

  ngOnInit(): void {
    this.formElementInit();
    this.getPerson();
    this.personFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPersons();
      });
  }
  formElementInit() {
    this.form = this.fb.group({
      personSelect: ['', Validators.required],
    });
  }
  getPerson() {
    const sb = this._coreService.customer.items$.subscribe(_persons => {
      this.persons = _persons;
      this.filterPerson.next(this.persons.slice());
    });
    this.subscriptions.push(sb);
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
  getStockOperationType(type: StockOperationType): StockOperationType {
    let opType!: StockOperationType;
    if (type == StockOperationType.ReBuy) {
      opType = StockOperationType.Buy;
    }
    else if (type = StockOperationType.ReSell) {
      opType = StockOperationType.Sell;
    }
    return opType;
  }
  getCustomerFactorDetail(customerId: number) {
    const sb = this._coreService.Operation.GetCustomerFactorDetails(customerId, this.getStockOperationType(this.stockOperationType)).subscribe(data => {

      this.dataSource.data = data.data
    });
    this.subscriptions.push(sb);
  }
  getShamsi(strDate: Date): string {
    let MomentDate = moment(strDate, 'YYYY/MM/DD');
    const date = MomentDate.locale('fa').format('YYYY/M/D');
    return date;
  }
  getStockNameById(stockId: number): string {

    let stockName: string = '';
    const sb = this._coreService.stock.stock$.subscribe(data => {
      data.forEach(item => {
        if (item.id == stockId) {
          stockName = item.name;
        }
      })
    });
    return stockName;
  }
  // getDetailFromRemittance(item:CustomerFactorDetailsVm,person:Customer){

  //   this._coreService.Operation.setRemittanceDetails(item.customerFactorGoods);
  //   this._remittanceMabna.emit(item.customerFactorGoods);
  //   this.nextStepper.completed = true;
  //   this.nextStepper._stepper.next();
  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  selectRemittance(item: CustomerFactorDetailsVm, person: Customer) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const modal_data = new ReturnHeaderDto();
    modal_data.personId = person.id;
    modal_data.refId = item.stockOperationId;
    modal_data.stockId = item.stockId;
    modal_data.stockOperationType = this.stockOperationType;


    dialogConfig.data = modal_data;
    const dialogRef = this.dialog.open(SetDateModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const data = new RetrnHeaderInfoDto();
        data.refId = item.stockOperationId;
        data.personName = person.name;
        data.personId = person.id;
        data.registerDate = this.getDate();
        data.stockName = this.getStockNameById(item.stockId);
        this._retrnHeaderInfoDto.emit(data);
        this._shareData.setGoodOfRemittance(item.customerFactorGoods);
        this._shareData.setCompletHeaderStep(true);
        // this.nextStepper.completed = true;
        // this.nextStepper._stepper.next();
      }
    })
  }
  getDate(): string {
    const sb = this._shareData.returnHeader$.subscribe(data => {
      if (data) {
        this.dateSelected = moment(data.registerDate.toString()).add(1,'day').format("jYYYY/jMM/jDD");
      }
    });
    this.subscriptions.push(sb);
    return this.dateSelected;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sp => sp.unsubscribe());
  }
}

