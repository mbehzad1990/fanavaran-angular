import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { ItemSalesBatchVm } from 'src/shared/Domain/ViewModels/_report/item-sales-batch-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-item-sale-batch-table',
  templateUrl: './item-sale-batch-table.component.html',
  styleUrls: ['./item-sale-batch-table.component.scss']
})
export class ItemSaleBatchTableComponent implements OnInit, OnDestroy {

  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  currentRow = -1;
  dataSource = new MatTableDataSource<ItemSalesBatchVm>();
  isHover: boolean = false;

  displayedColumns: string[] = ['index', 'invno', 'invno_Manuel',
   'salesDate','itemCodeDb', 'itemManuelCode',
   'itemName', 'batchNumber', 'qTY', 'price', 'amount',
    'customerCodeDb', 'customerManuelCode', 'customerName', 'month','isTransferdsSaleBatch'
  ];


  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion

  //#region Input & OutPut & Other
  //#endregion
  constructor(private _coreService: FacadService) {
    this.isLoading$ = this._coreService.report.isLoading$;
  }


  ngOnInit(): void {
  }
  getShamsi(strDate: string): string {
    return this._coreService.UtilityFunction.getShamsiString(strDate);
  }


   setDataIntoTable() {
    const sb = this._coreService.report.ItemSalesBatch$.subscribe(data => {
      this.dataSource.data = data;
    })
    this.subscriptions.push(sb);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
