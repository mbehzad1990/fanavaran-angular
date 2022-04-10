import { StockOperationType } from "../../Enums/global-enums";

export class ReportOperationVm {
    public id!:number;
    public manuelId!:string;
    public refId!:number;
    public stockId!:number;
    public stockName!:string;
    public personId!:number;
    public personName!:string;
    public stockOperationType!:StockOperationType;
    public registerDate!:Date;
    public description!:string;
}
