import { Byte } from "@angular/compiler/src/util";

export class User {
    public id!: number;
    public fullName!: string;
    public userName!: string;
    public passwordHash!: Byte[];
    public passwordSalt!: Byte[];
    public email!: string;
    public isActive!: boolean;
}
