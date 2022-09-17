import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { NotificationType, ResultAction } from 'src/shared/Domain/Enums/global-enums';
import { ItemRemainBatchVm } from 'src/shared/Domain/ViewModels/_report/item-remain-batch-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-remainbatch-table',
  templateUrl: './remainbatch-table.component.html',
  styleUrls: ['./remainbatch-table.component.scss']
})
export class RemainbatchTableComponent implements OnInit, OnDestroy {

  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  currentRow = -1;
  dataSource = new MatTableDataSource<ItemRemainBatchVm>();
  isHover: boolean = false;

  displayedColumns: string[] = ['index','stockDate', 'itemCode', 'itemManuelCode',
    'itemName', 'month', 'BatchNumber', 'price', 'amount', 'expireDate'
    , 'stock', 'damage', 'way', 'buyreturn','sellreturn','isTransferdRemainBatch'];


  isLoading$!: Observable<boolean>;
  rowIndex!: number;
  //#endregion

  //#region Input & OutPut & Other
  //#endregion

  constructor(private _coreService: FacadService) {
    this.isLoading$=this._coreService.report.isLoading$;
   }


  ngOnInit(): void {
  }
  getShamsi(strDate: string): string {
    return this._coreService.UtilityFunction.getShamsiString(strDate);
  }


   setDataIntoTable() {
    const sb = this._coreService.report.itemsRemain$.subscribe(data => {
      this.dataSource.data = data;
    })
    this.subscriptions.push(sb);
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
