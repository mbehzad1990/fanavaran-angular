import { StockOperationType } from "../../Enums/global-enums";

export class UpdateOperationHeaderVm {
    public operationId!:number;
    public stockId!:number;
    public refId:number=0;
    public personId!:number;
    public stockOperationType!:StockOperationType;
    public registerDate:string='';
    public description!:string;
}
