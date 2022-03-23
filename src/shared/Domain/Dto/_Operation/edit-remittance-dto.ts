import { StockOperationType } from "../../Enums/global-enums";

export class EditRemittanceDto {
    public stockOperationType!: StockOperationType;
    public operationId!:number;
}
