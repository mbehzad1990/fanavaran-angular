import { ResultAction } from "../../Enums/global-enums";

export class ResultDto<T> {
    public isSuccess!: boolean;
    public resultAction!: ResultAction;
    public location!: string;
    public exception!: string;
    public data!:T;
}
