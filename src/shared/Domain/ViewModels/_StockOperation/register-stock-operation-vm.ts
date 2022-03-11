import { StockOperationType } from "../../Enums/global-enums";

export class RegisterStockOperationVm {
    public stockId!:number;
    public personId!:number;
    public refId:number=0;
    public stockOperationType!:StockOperationType;
    public registerDate!:Date;
    public description!:string;
}
