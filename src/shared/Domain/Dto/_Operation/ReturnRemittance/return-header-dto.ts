import { MatStep } from "@angular/material/stepper";
import { StockOperationType } from "src/shared/Domain/Enums/global-enums";

export class ReturnHeaderDto {
    public manuelId!: string;
    public stockId!:number;
    public personId!:number;
    public refId:number=0; 
    public stockOperationType!:StockOperationType;

}
