export class GoodOfRemittanceDto {
    public goodId!:number;
    public goodManuelId!:number;
    public name!:string;
    public bacthNumber:string|null=null;
    public expireDate:string='';
    public count!:number;
    public price!:number;
    public amount!:number;
}
