import { StockOperationType } from "../../Enums/global-enums";

export class ReportOperationVm {
    public id!:number;
    public refId!:number;
    public stockId!:number;
    public stockName!:string;
    public personId!:number;
    public personName!:string;
    public stockOperationType!:StockOperationType;
    public registerDate!:Date;
    public description!:string;
}
