import { ActionType, DeleteOperationType } from "../../Enums/global-enums";

export class RequestModalDto<T> {
    public data!: T;
    public action!: ActionType;
    public delete_resource!:DeleteOperationType;
    public delete_field_name!:string;
}
