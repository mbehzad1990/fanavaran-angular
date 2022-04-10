import { StockOperationType } from "../../Enums/global-enums";

export class RegisterStockOperationVm {
    public stockId!:number;
    public manuelId!:string;
    public personId!:number;
    public refId:number=0;
    public stockOperationType!:StockOperationType;
    public registerDate!:string;
    public description!:string;
}
