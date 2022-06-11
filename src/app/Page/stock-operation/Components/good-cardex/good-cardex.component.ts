import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject, Subscription, takeUntil } from 'rxjs';
import { Stock } from 'src/shared/Domain/Models/_Stock/stock';
import { GoodDetailsVm } from 'src/shared/Domain/ViewModels/_Good/good-details-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { CardexTableComponent } from './cardex-table/cardex-table.component';

@Component({
  selector: 'app-good-cardex',
  templateUrl: './good-cardex.component.html',
  styleUrls: ['./good-cardex.component.scss']
})
export class GoodCardexComponent implements OnInit {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  isLoading$!: Observable<boolean>;

  stocks!: Stock[];
  stockFilterCtrl: FormControl = new FormControl();
  filterstock: ReplaySubject<Stock[]> = new ReplaySubject<Stock[]>(1);
  cardexForm!: FormGroup;
  protected _onDestroy = new Subject<void>();
  goods!: GoodDetailsVm[];
  public goodFilterCtrl: FormControl = new FormControl();
  public filterGoods: ReplaySubject<GoodDetailsVm[]> = new ReplaySubject<GoodDetailsVm[]>(1);
  //#endregion

  //#region Input & OutPut & Other
  @ViewChild('dataTable') dataTable!:CardexTableComponent;
  //#endregion
  constructor(private _coreService:FacadService, private fb: FormBuilder) { 
    this.isLoading$=this._coreService.Operation.isLoading$;

  }

  ngOnInit(): void {
    this.formElementInit();
    this.getStock();
    this.getGoods();

    this.stockFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterStocks();
    });
    this.goodFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterInGoods();
    });

   
  }
  formElementInit() {
    this.cardexForm = this.fb.group({
      stockSelect: [null, Validators.required],
      goodCtrl: [null, Validators.required,],
      // stockFilterCtrl: [''],
    });
  }


  errorHandling(control: string, error: string) {
    return this._coreService.errorHandler.conrollerErrorHandler(
      control,
      error,
      this.cardexForm
    );
  }
  getStock(){
    const sb=this._coreService.stock.stock$.subscribe(_stocks=>{
       this.filterstock.next(_stocks.slice());
      this.stocks=_stocks;
    });
    this.subscriptions.push(sb);
  }
  getGoods(){
    const sb=this._coreService.good.items$.subscribe(good=>{
      this.goods=good;
      this.filterGoods.next(this.goods.slice());
      
    });
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
  getCardex(stock:Stock,good:GoodDetailsVm){
    this.dataTable.getData(stock.id,good.id);
  }
}
