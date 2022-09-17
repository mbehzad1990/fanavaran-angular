import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { HeaderInfoDto } from 'src/shared/Domain/Dto/_Remittance/header-info-dto';
import { StockOperationType } from 'src/shared/Domain/Enums/global-enums';
import { RegisterStockOperationVm } from 'src/shared/Domain/ViewModels/_StockOperation/register-stock-operation-vm';
import { FacadService } from 'src/shared/Service/_Core/facad.service';
import { RemittanceHeaderComponent } from './Steps/remittance-header/remittance-header.component';

@Component({
  selector: 'app-remittance-main',
  templateUrl: './remittance-main.component.html',
  styleUrls: ['./remittance-main.component.scss']
})
export class RemittanceMainComponent implements OnInit ,OnDestroy {

  //#region Private field
private subscriptions: Subscription[] = [];
//#endregion

//#region Public field
formType!:StockOperationType;
headerInfo!:RegisterStockOperationVm;
headerInfoDto!:HeaderInfoDto;
_operationResult:boolean=false;
//#endregion

//#region Input & OutPut & Other
@ViewChild('stepHeader') stepHeader!:RemittanceHeaderComponent;
//#endregion
 constructor(private rout:ActivatedRoute,private _coreService:FacadService) { }

 ngOnInit(): void {
   this.rout.data.subscribe(data=>{
     this.formType=data['type'];
   });
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

 getHeaderInfo(_headerInfo:RegisterStockOperationVm){
   this.headerInfo=_headerInfo;
 }
 getHeaderDto(_headerInfo:HeaderInfoDto){
   this.headerInfoDto=new HeaderInfoDto();
   this.headerInfoDto=_headerInfo;
 }
 onStepChange(event: any): void {
  console.log(event.selectedIndex);
  if( this._operationResult){
    this.stepHeader.resetStep();
  }
}
rest(){
  this.stepHeader.resetStep();
}
getOperationStatus(operationResult:boolean){
  this._operationResult=operationResult;
  if(!this._operationResult){
    this.stepHeader.resetElementData();
  }
}
getOperationDateControl(){
  return this._coreService.appConfig.appConfig$.pipe(
    map(config=>config.operationDateControl)
  )
}
 ngOnDestroy(): void {
   this.subscriptions.forEach(sb=>sb.unsubscribe());
 }

}
