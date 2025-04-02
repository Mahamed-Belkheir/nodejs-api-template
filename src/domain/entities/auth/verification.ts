import { Entity, Property } from "@mikro-orm/core";
import { Base } from "./base";
import { Verification as DatabaseVerification } from "better-auth";

@Entity({
    tableName: "verification",
})
export class Verification extends Base implements DatabaseVerification {
    @Property()
    identifier!: string;
    @Property()
    value!: string;
    @Property({ type: Date })
    expiresAt!: Date;
}
