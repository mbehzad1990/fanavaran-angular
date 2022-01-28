import { ActionType, DeleteOperationType } from "../../Enums/global-enums";

export class RequestDeleteDto<T> {
    public data!: T;
    public action!: ActionType;
    public resource!:DeleteOperationType;
    public delete_field_name!:string;
    }
