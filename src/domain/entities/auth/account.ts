import { Entity, Property } from "@mikro-orm/core";
import { Base } from "./base";

import { Account as DatabaseAccount } from "better-auth";
@Entity({
    tableName: "account",
})
export class Account extends Base implements Omit<DatabaseAccount, "userId"> {
    @Property()
    providerId!: string;

    @Property({ nullable: true })
    accessToken?: string;

    @Property()
    accountId!: string;

    @Property()
    userId!: string;

    @Property({ nullable: true })
    refreshToken?: string;

    @Property({ nullable: true })
    accessTokenExpiresAt?: Date;

    @Property({ nullable: true })
    refreshTokenExpiresAt?: Date;

    @Property({ nullable: true })
    scope?: string;

    @Property({ nullable: true })
    idToken?: string;

    @Property({ nullable: true })
    password?: string;
}
