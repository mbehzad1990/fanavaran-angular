import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import * as moment from 'jalali-moment';
import { Customer } from 'src/shared/Domain/Models/_Customer/customer';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { ReportOperationVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-vm';
import { stringify } from '@angular/compiler/src/util';
import { NotificationType, StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { EditRemittanceSharedService } from './Service/edit-remittance-shared.service';
import { ReportOperationDetailVm } from 'src/shared/Domain/ViewModels/_Operation/report-operation-detail-vm';
import { GoodOfRemittanceDto } from 'src/shared/Domain/Dto/_Good/good-of-remittance-dto';
import { RemittanceCrudElementComponent } from './components/remittance-crud-element/remittance-crud-element.component';
import { RemittanceTableElementComponent } from './components/remittance-table-element/remittance-table-element.component';
import { UpdateOperationHeaderVm } from 'src/shared/Domain/ViewModels/_Operation/update-operation-header-vm';
import { UpdateOperationVm } from 'src/shared/Domain/ViewModels/_Operation/update-operation-vm';
import { MatButton } from '@angular/material/button';
import { UpdateOperationDetailsVm } from 'src/shared/Domain/ViewModels/_Operation/update-operation-details-vm';


@Component({
  selector: 'app-edit-remittance',
  templateUrl: './edit-remittance.component.html',
  styleUrls: ['./edit-remittance.component.scss']
})
export class EditRemittanceComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  private _actionMode!: boolean;
  private _EditItems: ReportOperationDetailVm[] = [];
  private _regDate!:Date;
  //#endregion

  //#region Public field

  /** control for the MatSelect filter keyword */
  isLoadComponents$!: Observable<boolean>;
  form!: FormGroup;
  dateSelected: string = '';
  persons!: Customer[];
  stocks!: Stock[];

  /** control for the MatSelect filter keyword */
  public personFilterCtrl: FormControl = new FormControl();
  public stockFilterCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  filterPerson: ReplaySubject<Customer[]> = new ReplaySubject<Customer[]>(1);
  filterstock: ReplaySubject<Stock[]> = new ReplaySubject<Stock[]>(1);

  numberPattern = '^[0-9]*$';
  _initData!: ReportOperationVm;
  //#region EditMode
  _Edit_Date: boolean = false;
  _Edit_Customer: boolean = false;
  _Edit_Stock: boolean = false;
  _operationType!: boolean; // false = return operation
  _selectDefualtPerson!: Customer;

  isLoading$!: Observable<boolean>;

  _registerDateString!: string;

  //#endregion

  //#endregion

  //#region Input & OutPut & Other
  @ViewChild('crudElement') crudElement!: RemittanceCrudElementComponent;
  @ViewChild('dataTable') dataTable!: RemittanceTableElementComponent;
  //#endregion

  constructor(private router: Router, private fb: FormBuilder, private _coreService: FacadService, private _localService: EditRemittanceSharedService, public activatedRoute: ActivatedRoute) {
    this.isLoadComponents$ = this._localService.showComponents$;
    this.getInitData(this.router);
    this._operationType = this.detectOperation(this._initData.stockOperationType);
    this.isLoading$ = this._coreService.Operation.isLoading$;
  }
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




  //#region Private Methods
  private detectOperation(type: StockOperationType): boolean {
    switch (type) {
      case StockOperationType.Buy:
      case StockOperationType.Damage:
      case StockOperationType.Sell:

        return true;
      case StockOperationType.ReBuy:
      case StockOperationType.ReSell:
        return false
    }
  }
  private selectPersonById(personId: number) {
    const person = this.persons.filter(p => p.id == personId)[0];
    this.form.controls['personSelect'].setValue(person);
  }
  private selectStockById(stockId: number) {
    const stock = this.stocks.filter(p => p.id == stockId)[0];
    this.form.controls['stockSelect'].setValue(stock);
  }
  protected getPerson() {
    const sb = this._coreService.customer.items$.subscribe(_persons => {
      this.persons = _persons;
      this.filterPerson.next(this.persons.slice());
      if (this.persons.length > 0) {
        this.selectPersonById(this._initData.personId);
      }
    });
    this.subscriptions.push(sb);
  }
  protected getStock() {
    const sb = this._coreService.stock.stock$.subscribe(_stocks => {
      this.stocks = _stocks;
      this.filterstock.next(_stocks.slice());
      if (this.stocks.length > 0) {
        this.selectStockById(this._initData.stockId);
      }
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
  private getInitData(router: Router) {
    const navigation = router.getCurrentNavigation();
    const urlData = navigation?.extras.state as { data: ReportOperationVm };
    this._initData = new ReportOperationVm();
    this._initData.id = urlData.data.id;
    this._initData.personId = urlData.data.personId;
    this._initData.personName = urlData.data.personName;
    this._initData.refId = urlData.data.refId;
    this._initData.registerDate = urlData.data.registerDate
    this._initData.stockId = urlData.data.stockId;
    this._initData.stockName = urlData.data.stockName;
    this._initData.stockOperationType = urlData.data.stockOperationType;
    this._initData.description = urlData.data.description;
    this._localService.setRemittanceDefualtData(this._initData);
  }
  private getDateString(date:Date):string{
    return this._coreService.UtilityFunction.convertMiladiDateToString(date);
  }
  private resetEditItem() {
    this._EditItems = [];
  }
  //#endregion

  //#region Public Methods

  getShamsi(strDate: Date): string {
    let MomentDate = moment(strDate, 'YYYY/MM/DD');
    return MomentDate.locale('fa').format('YYYY/M/D');
  }

  onChange(event: MatDatepickerInputEvent<moment.Moment>) {
    const s = event.value;
    // this.dateSelected = moment(event.value?.toISOString()).format("jYYYY/jMM/jDD");
    this._initData.registerDate = this._coreService.UtilityFunction.getMiladiDatefromStringDate(event.value!.toISOString());
  }

  getTitleOperationType(type: StockOperationType): string {
    switch (type) {
      case StockOperationType.Buy:
        return 'خرید';
      case StockOperationType.Sell:
        return 'فروش';
      case StockOperationType.ReBuy:
        return 'برگشت خرید';

      case StockOperationType.ReSell:
        return 'برگشت فروش';

      case StockOperationType.Damage:
        return 'ضایعات';
    }
  }
  formElementInit() {
    this.form = this.fb.group({
      datePicker: [new Date(), Validators.required],
      personSelect: [null, Validators.required],
      stockSelect: [null, Validators.required],
      mabna: [null],
      personFilterCtrl: [null],
      description: [null],

      // stockFilterCtrl: [''],
    });
  }
  setHeaderData() {

  }
  getTableData() {

  }
  fetchData() {
    // const sb = this._coreService.Operation.GetListOfOperationDetails(this.data.data).subscribe();
    // this.subscriptions.push(sb);
  }
  getData() {
    // const sb = this._coreService.Operation.operationDetailList$.subscribe(data => {
    //   debugger
    //   this.dataSource.data = data;
    // });
  }
  getItemForEdit(item: ReportOperationDetailVm[]) {
    this.resetEditItem();
    const editModel = new GoodOfRemittanceDto();
    editModel.amount = item[0].amount;
    editModel.bacthNumber = item[0].bacthNumber;
    editModel.count = item[0].count;
    if(item[0].expireDate!=''){
      editModel.expireDate =item[0].expireDate!
    }
    editModel.goodId = item[0].goodId;
    editModel.name = item[0].goodName;
    editModel.price = item[0].price;
    this._EditItems.push(item[0]);
    this.crudElement.editMode(editModel);
  }
  getItemExported(item: ReportOperationDetailVm) {
    this._EditItems.push(item);
    this.dataTable.updateTableDataSource(this._EditItems);
    this.resetEditItem();
  }
  getActionMode(mode: boolean) {
    this._actionMode = mode;
  }
  changePerson(person: Customer) {
    this._initData.personId = person.id;
    this._initData.personName = person.name;
  }
  changeStock(stock: Stock) {
    this._initData.stockId = stock.id;
    this._initData.stockName = stock.name;
  }
  save(btn: MatButton) {
    var updateModel = new UpdateOperationVm();
    var header = new UpdateOperationHeaderVm();
    var detail = new UpdateOperationDetailsVm();
    header.personId = this._initData.personId;
    header.operationId = this._initData.id;
    header.refId = this._initData.refId;
    header.registerDate=this.getDateString( this._initData.registerDate);
    header.stockId = this._initData.stockId;
    header.stockOperationType = this._initData.stockOperationType;

    updateModel.header = header;
    detail.goodDetails = this.dataTable.prepareDataForDb();
    updateModel.detail = detail;
    if (updateModel.detail.goodDetails.length == 0) {
      this._coreService.notification.showNotiffication(NotificationType.Warning, 'ریزقلمی برای ذخیره برای این حواله وجود ندارد');
    } else {
      this._coreService.Operation.update(updateModel).subscribe(result => {
        if (result?.isSuccess) {
          this._coreService.notification.showNotiffication(
            NotificationType.Success, 'ویرایش با موفقیت انجام شد');
          btn.disabled = true;
        }
      })
    }

  }
  back() {
    this.router.navigate(['/remittance/remittance-list']);
  }
  //#endregion

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
