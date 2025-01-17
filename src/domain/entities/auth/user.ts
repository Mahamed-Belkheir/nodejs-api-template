import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { TUser } from "../../../schemas/user";
import { randomUUID } from "crypto";
import { hash } from "argon2";

@Entity({
    tableName: "user",
})
export class User implements TUser {
    @PrimaryKey()
    id: string;

    @Property()
    fullName: string;

    @Property()
    email: string;

    @Property()
    password: string;

    @Property()
    createdAt: string;

    @Property()
    updatedAt: string;

    constructor(data: Pick<TUser, "email" | "fullName" | "password">) {
        this.id = randomUUID();
        this.fullName = data.fullName;
        this.email = data.email;
        this.password = data.password;
        this.createdAt = new Date().toJSON();
        this.updatedAt = this.createdAt;
    }

    async hashPassword() {
        this.password = await hash(this.password);
    }
}
