import { StockOperationType } from "../../Enums/global-enums";

export class ReportOperationVm {
    public id!:number;
    public bacthNumber!:number;
    public stockId!:number;
    public stockName!:number;
    public personId!:number;
    public personName!:number;
    public stockOperationType!:StockOperationType;
    public registerDate!:Date;
    public description!:string;
}
