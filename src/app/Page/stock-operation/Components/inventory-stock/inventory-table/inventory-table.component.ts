import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ReportGoodsInStockVm } from 'src/shared/Domain/ViewModels/_Operation/report-goods-in-stock-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {

    //#region Public field
    isLoading$!: Observable<boolean>;
    dataSource=new MatTableDataSource<ReportGoodsInStockVm>();
    displayedColumns: string[] = ['index', 'goodId', 'goodName', 'unitName', 'count'];
    //#endregion
  
    //#region Private field
    //#endregion
  
    //#region Input & Output
    @Input() stockId!:number;
    //#endregion
  constructor(private _coreSevice:FacadService) { 
    this.isLoading$=this._coreSevice.Operation.isLoading$;
  }

  ngOnInit(): void {
  }
  getData(stockId:number) {
    const sb = this._coreSevice.Operation.GetGoodsInStock(stockId).subscribe(result => {
      this.dataSource.data=result.data;
    })
  }
}
