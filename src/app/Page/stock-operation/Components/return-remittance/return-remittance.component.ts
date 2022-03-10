import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { RetrnHeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/retrn-header-info-dto';
import { StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { CustomerFactorGoodsVm } from 'src/shared/Domain/ViewModels/_stockOperationDetail/customer-factor-goods-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';

@Component({
  selector: 'app-return-remittance',
  templateUrl: './return-remittance.component.html',
  styleUrls: ['./return-remittance.component.scss']
})
export class ReturnRemittanceComponent implements OnInit, OnDestroy {

  //#region Private field
  private subscriptions: Subscription[] = [];
  //#endregion

  //#region Public field
  formType!: StockOperationType;
  // headerInfo!: RegisterStockOperationVm;
  headerInfoDto!: RetrnHeaderInfoDto;
  remittanceDetail!: CustomerFactorGoodsVm[];
  _operationResult: boolean = false;
  //#endregion

  //#region Input & OutPut & Other
  // @ViewChild('stepHeader') stepHeader!: RemittanceHeaderComponent;
  //#endregion
  constructor(private rout: ActivatedRoute, private _coreService: FacadService) { }

  ngOnInit(): void {
    this.rout.data.subscribe(data => {
      this.formType = data['type'];
    });
  }
  onStepChange(event: any): void {
    console.log(event.selectedIndex);
    // if( this._operationResult){
    //   this.stepHeader.resetStep();
    // }
  }
  setTitle(type:StockOperationType):string{
    switch (type) {
      case StockOperationType.Buy:
        return 'مشخصات اولیه حواله خرید';
      case StockOperationType.Sell:
        return 'مشخصات اولیه حواله فروش';
      case StockOperationType.ReBuy:
        return 'مشخصات اولیه حواله برگشت از خرید';
 
      case StockOperationType.ReSell:
        return 'مشخصات اولیه حواله برگشت از فروش';
 
      case StockOperationType.Damage:
        return 'مشخصات اولیه حواله ضایعات';
    }
  }
  setContainerTitle(type:StockOperationType):string{
    switch (type) {
      case StockOperationType.Buy:
        return 'حواله خرید';
      case StockOperationType.Sell:
        return 'حواله فروش';
      case StockOperationType.ReBuy:
        return 'حواله برگشت از خرید';
 
      case StockOperationType.ReSell:
        return 'حواله برگشت از فروش';
 
      case StockOperationType.Damage:
        return 'حواله ضایعات';
    }
  }
  getHeaderInfo(headerInfo:RetrnHeaderInfoDto){
    this.headerInfoDto=headerInfo;
  }
  getRemittanceDetail(details:CustomerFactorGoodsVm[]){
    this.remittanceDetail=details;
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe);
  }
}
