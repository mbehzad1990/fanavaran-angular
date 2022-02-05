import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { InventoryTableComponent } from './inventory-table/inventory-table.component';

@Component({
  selector: 'app-inventory-stock',
  templateUrl: './inventory-stock.component.html',
  styleUrls: ['./inventory-stock.component.scss']
})
export class InventoryStockComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  stocks!: Stock[];
  stockFilterCtrl: FormControl = new FormControl();
  filterstock: ReplaySubject<Stock[]> = new ReplaySubject<Stock[]>(1);
  inventoryForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  //#endregion

  //#region Input & OutPut & Other
  @ViewChild('dataTable') dataTable!:InventoryTableComponent;
  //#endregion


  constructor(private _coreService: FacadService, private fb: FormBuilder) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  ngOnInit(): void {
    this.formElementInit();
    this.getStock();
    this.stockFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterStocks();
    });
  }
  formElementInit() {
    this.inventoryForm = this.fb.group({
      stockSelect: [null, Validators.required],

      // stockFilterCtrl: [''],
    });
  }


  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.inventoryForm
    );
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
  getDataByStockId(stock: Stock){
    this.dataTable.getData(stock.id);
  }
  

}
