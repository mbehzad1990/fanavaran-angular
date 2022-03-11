import { StockOperationType } from "../../Enums/global-enums";
import { CustomerFactorGoodsVm } from "../_stockOperationDetail/customer-factor-goods-vm";

export class CustomerFactorDetailsVm {
    public stockOperationId!:number;
    public refId!:number;
    public registerDate!:Date;
    public stockId!:number;
    public personId!:number;
    public description!:number;
    public stockOperationType!:StockOperationType;
    public customerFactorGoods!:CustomerFactorGoodsVm[];
}
