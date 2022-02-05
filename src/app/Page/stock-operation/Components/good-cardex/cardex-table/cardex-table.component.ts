import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { GoodCardexVM } from 'src/shared/Domain/ViewModels/_Operation/good-cardex-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-cardex-table',
  templateUrl: './cardex-table.component.html',
  styleUrls: ['./cardex-table.component.scss']
})
export class CardexTableComponent implements OnInit {

  //#region Public field
  isLoading$!: Observable<boolean>;
  dataSource = new MatTableDataSource<GoodCardexVM>();
  displayedColumns: string[] = ['index', 'goodId', 'goodName', 'unitName', 'stockOperationId',
'stockOperationType','entireCount','outPutCount','previousRemainCount','currentRemainCount'];
  //#endregion

  //#region Private field
  //#endregion

  //#region Input & Output
  //#endregion
  constructor(private _coreService:FacadService) { 
    this.isLoading$=this._coreService.Operation.isLoading$;

  }

  ngOnInit(): void {
  }

  getData(stockId:number,goodId:number){
     this._coreService.Operation.GetGoodCardex(100,1000).subscribe(result=>{
     this.dataSource.data=result.data;
    });
  }
  getOperationType(type: StockOperationType): string {
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
}
