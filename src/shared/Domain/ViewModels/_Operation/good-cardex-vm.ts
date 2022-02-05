import { StockOperationType } from "../../Enums/global-enums";

export class GoodCardexVM {

    public goodId!:number;
    public goodName!:string;
    public unitName!:string;
    public stockOperationId!:number;
    public stockOperationType!:StockOperationType;
    public price!:number;
    public amount!:number;
    public bacthNumber!:number;
    public expireDate!:Date;
    public tempCount!:number;
    public entireCount!:number;
    public outPutCount!:number;
    public previousRemainCount!:number; 
    public currentRemainCount!:number;
}
