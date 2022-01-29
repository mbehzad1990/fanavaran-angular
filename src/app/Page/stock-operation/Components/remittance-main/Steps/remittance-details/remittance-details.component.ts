import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { GoodDetailDto } from 'src/shared/Domain/Dto/_Good/good-detail-dto';
import { HeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/header-info-dto';
import { NotificationType } from 'src/shared/Domain/Enums/global-enums';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-remittance-details',
  templateUrl: './remittance-details.component.html',
  styleUrls: ['./remittance-details.component.scss']
})
export class RemittanceDetailsComponent implements OnInit, OnDestroy {
  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  // formType!:StockOperationType;
  listOfGood: GoodDetailDto[] = [];
  dataSource = new MatTableDataSource<GoodDetailDto>(this.listOfGood);
  displayedColumns: string[] = ['index', 'name', 'count', 'price', 'amount','unitName' ,'desc','delete'];

  isLoading$!: Observable<boolean>;

  isLoading = false;
  isOpen = false;
  //#endregion

  //#region Input & OutPut & Other
  @Input() headerInfo!: RegisterStockOperationVm;
  @Input() headerInfoDto!: HeaderInfoDto;
  //#endregion
  constructor(private _coreService: FacadService) {
    this.isLoading$ = this._coreService.Operation.isLoading$;
  }


  ngOnInit(): void {
  }

  getItem(_item: GoodDetailDto) {
    debugger
    let isExist = false;
    this.listOfGood.forEach(item => {
      if (item.goodName == _item.goodName) {
        isExist = true;
      }
    })
    if (!isExist) {
      this.listOfGood.push(_item);
      this.dataSource.data = this.listOfGood;
    } else {
      this._coreService.notification.showNotiffication(NotificationType.Warning, 'نام کالا تکراری است');
    }
  }
  deletItemFromList(deleteItem: GoodDetailDto) {
    const data = this.dataSource.data;
    const index: number = data.indexOf(deleteItem);
    if (index !== -1) {
      data.splice(index, 1);
      this.dataSource.data = data;
    }
  }
  addGoods() {

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
