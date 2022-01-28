import { StockOperationType } from "../../Enums/global-enums";

export class RegisterStockOperationVm {
    public bacthNumber!:number;
    public stockId!:number;
    public personId!:number;
    public stockOperationType!:StockOperationType;
    public registerDate!:Date;
    public description!:string;
}
